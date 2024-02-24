import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { CardTemplate } from "./Base"
import { CardTypeDropDown } from "../components/SettingsDropDown"
import { useState } from "react"

export const CardTab = ({ id }: { id?: number }) => {

    const [defaultCardId, setDefaultCard] = useState(-1)

    const { register, handleSubmit } = useForm();
    function onSubmit(data: any) {
        fetch("/api/board/settings/card", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: id,
                ...data
            }),
        })
    }

    const { data: cardTemplates } = useQuery<CardTemplate[]>({
        queryKey: ["boardSetting", id],
        queryFn: () => (fetch("/api/board/cardTemplates", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: id,
            }),
        }).then(async (res) => {
            const listCardTemplates = await res.json() as CardTemplate[]
            const defaultCardTemplateId = listCardTemplates.find(i => i.isDefault)?.id as number
            setDefaultCard(defaultCardTemplateId)
            return listCardTemplates
        }))
    })

    if (!cardTemplates)
        return <p>error</p>

    return (
        <TabsContent value="card">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* <RadioGroup defaultValue="1"> */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Default</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Card type</TableHead>
                            <TableHead /> {/* for settings */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cardTemplates.map(i => {
                            return (
                                <TableRow>
                                    <TableCell className="font-medium">
                                        {/* <RadioGroupItem
                                                {...register("isDefault")}
                                                value={i.id.toString()}
                                            /> */}
                                        <input
                                            {...register("isDefault")}
                                            value={i.id.toString()}
                                            checked={defaultCardId === i.id}
                                            type="radio"
                                            className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
                                            onChange={() => setDefaultCard(i.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            {...register(i.id + "-card")}
                                            defaultValue={i.name}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <CardTypeDropDown
                                            cardType={i.cardType.id}
                                            register={register}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <img src="/setting.svg" />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {/* </RadioGroup> */}
                <input type="submit" />
            </form>
        </TabsContent>
    )
}
