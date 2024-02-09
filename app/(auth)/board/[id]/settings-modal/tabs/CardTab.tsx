import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TabsContent } from "@/components/ui/tabs"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { CardTemplate, CardType } from "./Base"
import { CardTypeDropDown } from "../components/CardTypeDropDown"

export const CardTab = ({ id }: { id?: number }) => {

    const { register, handleSubmit } = useForm();
    const onSubmit = (data: any) => console.log(data)

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
        }).then((res) => res.json()))
    })

    if (!cardTemplates)
        return <p>error</p>
    
    const defaultCard = cardTemplates.find(i => i.isDefault)

    return (
        <TabsContent value="card">
            <form onSubmit={handleSubmit(onSubmit)}>
                <RadioGroup defaultValue="1">
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
                                                checked={defaultCard?.id === i.id}
                                                type="radio"
                                                className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                {...register("card" + i.id.toString())}
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
                </RadioGroup>
                <input type="submit" />
            </form>
        </TabsContent>
    )
}
