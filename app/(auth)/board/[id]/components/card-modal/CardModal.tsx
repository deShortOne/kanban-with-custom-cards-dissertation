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
import { TextField, TextArea } from "./field-type/Basic";

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

    const formSchema = z.object(
        cardData ? cardData.cardTemplate
            .tabs
            .flatMap(i => i.tabFields)
            .map(i => ({ key: i.id, value: i.fieldType.name }))
            .reduce((obj, item) => (obj["a" + item.key] = fieldTypeToZodType(item.value), obj), {})
            : { empty: -1 }
    )


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const defaultValues = cardData ? cardData.allTabsFieldInformation
        .reduce((obj, item) => (obj["a" + item.id] = item.data, obj), {})
        : { empty: -1 }

    console.log(defaultValues);

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
                <div className='grid grid-cols-1 gap-4'>
                    <div className="mb-6 border">
                        <input type="text" id="title" className="block w-5/6 p-4 text-gray-900 rounded-lg sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-background text-xl" value={"title here"} />
                        <hr />
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {cardData.cardTemplate.tabs[0].tabFields.map(field => {
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
                                }
                                return <p></p>
                            })}
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                    <button onClick={onClose}>
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function fieldTypeToZodType(fieldType: string) {
    switch (fieldType) {
        case 'Text field':
        case 'Text area':
            return z.string()
        case 'Date picker':
            return z.date()
        default:
            return z.string() // should probs be returning error instead
    }
}
