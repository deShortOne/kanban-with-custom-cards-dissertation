import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FieldTypeProp } from "./Base"
import { useFieldArray, useFormContext } from "react-hook-form"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const loadingText = "...loading..."

export const GitHubBranchTracker = ({ form, fieldTypeData, name }: FieldTypeProp) => {

    const data = fieldTypeData.split(";")

    const label = data[0]

    const { getValues, control, register, handleSubmit } = useFormContext();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: name + ".branches",
    })

    const getBranchStatus = async (id: string, branchName: string) => {
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

        const data = await response.json()
        updateBranchStatuses((prevInfo: any) => ({ ...prevInfo, [convertIdToString(id)]: data }))
    }
    const [branchStatus, updateBranchStatuses] = useState<any>({ "a": "b" })
    useEffect(() => {
        fields.forEach(async (i, idx) =>
            branchStatus.hasOwnProperty(convertIdToString(i.id))
                ?
                null
                :
                await getBranchStatus(i.id, getValues()[name].branches[idx].branchName)
        )

    }, [])

    return (
        <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
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
                                <img src="/help.svg" className="h-[20px]" />
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
                            <TableHead>Status</TableHead>
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
                                        <img src="/delete.svg" />
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
