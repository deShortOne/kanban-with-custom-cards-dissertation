import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FieldTypeProp } from "./Base"
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const GitHubBranchTracker = ({ form, fieldTypeData, name }: FieldTypeProp) => {

    const data = fieldTypeData.split(";")

    const label = data[0]

    const { getValues, control, register } = useFormContext();

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: name + ".branches",
    })

    const [branchStatus, updateBranchStatuses] = useState({ "a": "b" })
    useEffect(() => {
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
            updateBranchStatuses(prevInfo => ({ ...prevInfo, ["a" + id.replaceAll("-", "")]: data }))
        }

        fields.forEach(async (i, idx) =>
            branchStatus.hasOwnProperty("a" + i.id.replaceAll("-", ""))
                ?
                null
                :
                await getBranchStatus(i.id, getValues()[name].branches[idx].branchName)
        )

    }, [])

    return (
        <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Input {...register(name + ".repo")} className="w-48" />
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
                        <TableRow>
                            <TableCell>
                                <Input key={field.id}
                                    {...register(name + `.branches.${index}.title`)}
                                    className="font-medium"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    key={field.id}
                                    {...register(name + `.branches.${index}.branchName`)}
                                    className="font-medium aria-readonly"
                                />
                            </TableCell>
                            <TableCell>
                                {branchStatus.hasOwnProperty("a" + field.id.replaceAll("-", ""))
                                    ?
                                    branchStatus["a" + field.id.replaceAll("-", "")]
                                    :
                                    "...loading..."
                                }
                            </TableCell>
                            <TableCell>
                                Icon
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </FormItem>
    )
}