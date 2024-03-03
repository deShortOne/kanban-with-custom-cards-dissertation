import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FieldTypeProp } from "./Base"
import { useFieldArray, useFormContext } from "react-hook-form"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

const loadingText = "...loading..."

export const GitHubBranchTracker = ({ form, fieldTypeData, name }: FieldTypeProp) => {
    const [tokenIsValid, setTokenIsValid] = useState<"connecting" | "connected" | "invalid token">("connecting")
    const [numberOfCurrentlyFetchingStatus, setNumberOfCurrentlyFetchingStatus] = useState(0)

    const data = fieldTypeData.split(";")

    const label = data[0]

    const { getValues, control, register, handleSubmit } = useFormContext();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: name + ".branches",
    })

    const getBranchStatus = async (id: string, branchName: string) => {
        setNumberOfCurrentlyFetchingStatus(numberOfCurrentlyFetchingStatus + 1)

        const response = await fetch('/api/github/branch/status?'
            + new URLSearchParams({
                owner: "deShortOne", // TODO !!!!!!
                repo: getValues()[name].repo,
                branch: branchName
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 498) {
            setTokenIsValid("invalid token")
            setNumberOfCurrentlyFetchingStatus(0)
        } else {
            const data = await response.json()
            updateBranchStatuses((prevInfo: any) => ({ ...prevInfo, [convertIdToString(id)]: data }))
            setTokenIsValid("connected")
            setNumberOfCurrentlyFetchingStatus(numberOfCurrentlyFetchingStatus - 1)
        }
    }
    const [branchStatus, updateBranchStatuses] = useState<any>({ "a": "b" })
    const refreshBranchStatuses = () => {
        updateBranchStatuses({})
        setNumberOfCurrentlyFetchingStatus(0)
        fields.forEach(async (i, idx) =>
            await getBranchStatus(i.id, getValues()[name].branches[idx].branchName)
        )
    }
    useEffect(() => {
        refreshBranchStatuses()
    }, [refreshBranchStatuses])

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
                            (<a href="http://localhost:3000/api/github/token" target="_blank">invalid token</a>)
                            :
                            (<div className="cursor-default">{tokenIsValid}</div>)
                        }
                    </span>
                </div>
            </div>
            <div className="flex">
                <Input
                    {...register(name + ".repo", { onBlur: handleSubmit(() => { }) })} // why must something be entered...?
                    className="w-48"
                    placeholder="repo"
                    disabled={getValues()[name].branches?.length !== 0}
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
            <ScrollArea className="h-[50vh]">
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
                                    <Input
                                        key={field.id}
                                        {...register(name + `.branches.${index}.branchName`)}
                                        className="font-medium aria-readonly"
                                        placeholder="branch name"
                                        onBlur={() => {
                                            updateBranchStatuses((prevInfo: any) => (
                                                {
                                                    ...prevInfo,
                                                    [convertIdToString(field.id)]: loadingText
                                                }
                                            ))
                                            getBranchStatus(field.id, getValues()[name].branches[index].branchName)
                                        }}
                                    />
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
                                            width={24}
                                            height={24}
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
            >
                Add
            </Button>
        </FormItem>
    )
}

function convertIdToString(id: string) {
    return "a" + id.replaceAll("-", "")
}
