import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FieldTypeProp } from "../Base"
import { useFieldArray, useFormContext } from "react-hook-form"
import { useEffect, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import { SelectOwnerRepo } from "./SelectOwnerRepo"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const loadingText = "...loading..."

export const GitHubBranchTracker = ({ fieldTypeData, name }: FieldTypeProp) => {
    const [tokenIsValid, setTokenStatus] = useState<"connecting" | "connected" | "invalid token">("connecting")
    const [numberOfCurrentlyFetchingStatus, setNumberOfCurrentlyFetchingStatus] = useState(0)

    const data = fieldTypeData.split(";")

    const label = data[0]

    const { getValues, control, register, handleSubmit, setValue } = useFormContext();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: name + ".branches",
    })

    const getBranchStatus = async (id: string, branchName: string) => {
        setNumberOfCurrentlyFetchingStatus(numberOfCurrentlyFetchingStatus + 1)

        const response = await fetch('/api/github/branch/status?'
            + new URLSearchParams({
                ownerRepo: getValues()[name].repo,
                branch: branchName
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 498) {
            setTokenStatus("invalid token")
            setNumberOfCurrentlyFetchingStatus(0)
        } else {
            const data = await response.json()
            updateBranchStatuses((prevInfo: any) => ({ ...prevInfo, [convertIdToString(id)]: data }))
            setTokenStatus("connected")
            setNumberOfCurrentlyFetchingStatus(numberOfCurrentlyFetchingStatus - 1)
        }
    }
    const [branchStatus, updateBranchStatuses] = useState<any>({ "a": "b" })
    const refreshBranchStatuses = async () => {
        if (fields.length === 0) {
            const response = await fetch('/api/github/token/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            setTokenStatus(await response.json())
            return
        }

        updateBranchStatuses({})
        setNumberOfCurrentlyFetchingStatus(0)
        fields.forEach(async (i, idx) =>
            await getBranchStatus(i.id, getValues()[name].branches[idx].branchName)
        )
    }
    useEffect(() => {
        refreshBranchStatuses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // only want run once

    const [branches, setBranches] = useState<string[]>([])
    const getBranches = async () => {
        const response = await fetch('/api/github/branch/all?' +
            new URLSearchParams({
                ownerRepo: getValues()[name].repo,
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 498) {
            setTokenStatus("invalid token")
        } else {
            const data = await response.json()
            setBranches(data)
        }
    }

    return (
        <FormItem className="flex flex-col">
            <div className="flex justify-between">
                <FormLabel>{label}</FormLabel>
                <div className="flex">
                    <span className={"inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full " +
                        (tokenIsValid === "connecting"
                            ?
                            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            :
                            (tokenIsValid === "connected"
                                ?
                                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                :
                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300")
                        )
                    }>
                        {tokenIsValid === "connecting" || tokenIsValid === "connected"
                            ?
                            (<span
                                className={"w-2 h-2 me-1 rounded-full " +
                                    (tokenIsValid === "connecting" ? "bg-orange-500" : "bg-green-500")
                                }
                            />)
                            :
                            <span className="relative me-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        }

                        {tokenIsValid === "invalid token"
                            ?
                            (<a href="/api/github/token" target="_blank">invalid token</a>)
                            :
                            (<div className="cursor-default">{tokenIsValid}</div>)
                        }
                    </span>
                </div>
            </div>
            <div className="flex">
                <SelectOwnerRepo
                    name={name}
                    repo={getValues()[name].repo}
                    isDisabled={getValues()[name].branches?.length !== 0}
                    setValue={setValue}
                    setTokenStatus={setTokenStatus}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild className="h-[20px]">
                            <button type="button">
                                <Image
                                    src="/help.svg"
                                    alt="help with repo name and adding branch"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>To add branches to track, you must set the repo</p>
                            <p>To change the repo, you must remove all branches</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <ScrollArea className="h-[60vh]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20vw]">Feature title</TableHead>
                            <TableHead className="w-[20vw]">Branch name</TableHead>
                            <TableHead>
                                <div className="flex">
                                    Status
                                    <button onClick={() => refreshBranchStatuses()}>
                                        <Image src="/refresh.svg" className={
                                            numberOfCurrentlyFetchingStatus === 0 || tokenIsValid === "connecting"
                                                ?
                                                "animate-spin"
                                                :
                                                ""}
                                            alt="refresh github branch statuses"
                                            width={24}
                                            height={24}
                                        />

                                    </button>
                                </div>
                            </TableHead>
                            <TableHead className="w-[10vw]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id + " -> " + index}>
                                <TableCell>
                                    <Input key={field.id}
                                        {...register(name + `.branches.${index}.title`)}
                                        className="font-medium"
                                        placeholder="feature name"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Select
                                        onValueChange={(val) => setValue(name + `.branches.${index}.branchName`, val)}
                                        onOpenChange={() => { getBranches() }}
                                        defaultValue={getValues(name + `.branches.${index}.branchName`)}
                                    >
                                        <SelectTrigger className="w-96">
                                            <SelectValue placeholder="Select branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                branches.length === 0
                                                    ?
                                                    (
                                                        <div>
                                                            <SelectItem value={
                                                                getValues(name + `.branches.${index}.branchName`) == "" ? "__" : getValues(name + `.branches.${index}.branchName`)
                                                            }>
                                                                {getValues(name + `.branches.${index}.branchName`)}
                                                            </SelectItem>
                                                            <Skeleton className="my-2 h-2 w-[250px]" />
                                                            <Skeleton className="my-2 h-2 w-[250px]" />
                                                        </div>
                                                    )
                                                    :
                                                    <SelectGroup>
                                                        {
                                                            branches.map(i =>
                                                                <SelectItem value={i} key={i}>
                                                                    {i}
                                                                </SelectItem>
                                                            )
                                                        }
                                                    </SelectGroup>
                                            }
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {branchStatus.hasOwnProperty(convertIdToString(field.id))
                                        ?
                                        branchStatus[convertIdToString(field.id)]
                                        :
                                        loadingText
                                    }
                                </TableCell>
                                <TableCell>
                                    <button onClick={() => remove(index)}>
                                        <Image
                                            src="/delete.svg"
                                            alt="delete branch status checker"
                                            className="dark:invert"
                                            width={24}
                                            height={24}
                                            priority
                                        />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
            <Button
                onClick={() => append({})}
                type="button"
                disabled={getValues()[name].repo === ""}
                variant="secondary"
                className="bg-green-300 hover:bg-green-500"
            >
                Add
            </Button>
        </FormItem >
    )
}

function convertIdToString(id: string) {
    return "a" + id.replaceAll("-", "")
}
