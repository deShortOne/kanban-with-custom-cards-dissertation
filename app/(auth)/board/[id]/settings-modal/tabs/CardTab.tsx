"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { CardTemplate } from "./Base"
import { useState } from "react"
import Link from 'next/link';
import Image from "next/image"

export const CardTab = ({ id }: { id: number }) => {
    const [defaultCardId, setDefaultCard] = useState(-1)

    const { data: cardTemplates } = useQuery<CardTemplate[]>({
        queryKey: ["boardSetting", id],
        queryFn: () => (fetch("/api/board/settings/card?" +
            new URLSearchParams({
                kanbanId: id.toString(),
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            const listCardTemplates = await res.json() as CardTemplate[]
            const defaultCardTemplateId = listCardTemplates
                .find(i => i.ActiveCardTypes.isDefault)?.cardType.id as number
            setDefaultCard(defaultCardTemplateId)
            return listCardTemplates
        }))
    })

    const FormSchema = z.object({
        isDefault: z.string({
            required_error: "You need to select a notification type.",
        }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })
    function onSubmit(data: z.infer<typeof FormSchema>) {
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

    if (!cardTemplates)
        return (
            <TabsContent value="card">
                Loading
            </TabsContent>
        )

    return (
        <TabsContent
            value="card"
            id="tabSettingCards"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="isDefault"
                        render={({ field }) => (
                            <div>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={defaultCardId?.toString()}
                                >
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Default</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Card type</TableHead>
                                                <TableHead />{/* for settings */}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {cardTemplates.map(i => {
                                                return (
                                                    <TableRow key={i.id}>
                                                        <TableCell>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        {...field}
                                                                        value={i.cardType.id.toString()}
                                                                        className="ml-[15px]"
                                                                    />
                                                                </FormControl>
                                                            </FormItem>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Label>{i.name}</Label>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="max-h-[24px]" variant="outline">
                                                                {i.cardType.name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Link href={"/card/" + i.id}>
                                                                <Button variant="ghost">
                                                                    <Image
                                                                        src="/setting.svg"
                                                                        alt="Settings"
                                                                        width={24} height={24}
                                                                    />
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                    <Button type="submit">Save</Button>
                                </RadioGroup>
                            </div>
                        )} />
                </form>
            </Form>
        </TabsContent>
    )
}
