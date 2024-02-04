'use client'

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form";

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useCardModal } from "./useDialog"
import { CardData } from "./field-type/Base"
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextField, TextArea, Title } from "./field-type/Basic";
import { DatePicker } from "./field-type/DatePicker";
import { CheckboxMultiple } from "./field-type/CheckBox";
import { ComboboxForm } from "./field-type/DropDown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const CardModal = () => {
    const id = useCardModal(state => state.id)
    const isOpen = useCardModal(state => state.isOpen)
    const onClose = useCardModal(state => state.onClose)

    const { data: cardData } = useQuery<CardData>({
        queryKey: ["card", id],
        queryFn: () => (fetch("/api/card/data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),
        }).then((res) => res.json()))
    })

    const schemaForFields = cardData ? cardData.cardTemplate
        .tabs
        .flatMap(i => i.tabFields)
        .map(i => ({ key: i.id, value: i.fieldType.name }))
        .reduce((obj, item) => (obj["a" + item.key] = fieldTypeToZodType(item.value), obj), {})
        : { empty: -1 }
    schemaForFields["title" + cardData?.id] = z.string()

    const formSchema = z.object(
        schemaForFields
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const defaultValues = cardData ? cardData.allTabsFieldInformation
        .reduce((obj, item) => (obj["a" + item.id] = item.data, obj), {})
        : { empty: -1 }

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // âœ… This will be type-safe and validated.
        console.log(values);
    }

    if (!cardData)
        return <p>No card open</p>

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="h-[90vh] min-w-[90vw]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Title form={form} fieldTypeData={cardData.title} name={"title" + cardData.id} defaultValues="" />
                        <Tabs defaultValue={cardData.cardTemplate.tabs[0].name} className="w-[400px]">
                            <TabsList>
                                {cardData.cardTemplate.tabs.map(tab => {
                                    return <TabsTrigger value={tab.name}>{tab.name}</TabsTrigger>
                                })}
                            </TabsList>

                            {cardData.cardTemplate.tabs.map(tab => {
                                return <TabsContent value={tab.name}>
                                    {tab.tabFields.map(field => {
                                        switch (field.fieldType.name) {
                                            case 'Text field':
                                                return <TextField form={form}
                                                    fieldTypeData={field.data}
                                                    defaultValues={defaultValues}
                                                    name={"a" + field.id} />
                                            case 'Text area':
                                                return <TextArea form={form}
                                                    fieldTypeData={field.data}
                                                    defaultValues={defaultValues}
                                                    name={"a" + field.id} />
                                            case 'Date picker':
                                                return <DatePicker form={form}
                                                    fieldTypeData={field.data}
                                                    defaultValues={defaultValues}
                                                    name={"a" + field.id} />
                                            case 'Check boxes':
                                                return <CheckboxMultiple form={form}
                                                    fieldTypeData={field.data}
                                                    defaultValues={defaultValues}
                                                    name={"a" + field.id} />
                                            case 'Drop down':
                                                return <ComboboxForm form={form}
                                                    fieldTypeData={field.data}
                                                    defaultValues={defaultValues}
                                                    name={"a" + field.id} />
                                        }
                                        return <p></p>
                                    })}
                                </TabsContent>
                            })}
                        </Tabs>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
                <button onClick={onClose}>
                    Close
                </button>
            </DialogContent>
        </Dialog >
    )
}

function fieldTypeToZodType(fieldType: string) {
    switch (fieldType) {
        case 'Text field':
        case 'Text area':
            return z.string()
        case 'Date picker':
            return z.date()
        case 'Check boxes':
            return z.array(z.string()).refine((value) => value.some((item) => item), {
                message: "You have to select at least one item.",
            })
        case 'Drop down':
            return z.string({
                required_error: "You have to select at least one item.",
            })
        default:
            return z.string() // should probs be returning error instead
    }
}
