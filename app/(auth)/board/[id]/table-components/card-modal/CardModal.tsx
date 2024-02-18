'use client'

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query"
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

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
import { GitHubBranchTracker } from "./field-type/GitHubBranchTracker";

// This is used to check if fields for card has already been input
// Check is used to prevent overwriting of new user input
const cardIdsLoaded: number[] = []

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

    const fieldIdAndType = cardData?.cardTemplate
        .tabs
        .flatMap(i => i.tabFields)
        .map(i => ({ key: i.id, value: i.fieldType.name }))

    const schemaForFields = fieldIdAndType ? fieldIdAndType
        .reduce((obj, item) => (obj["a" + item.key] = fieldTypeToZodType(item.value), obj), {})
        : { empty: -1 }
    schemaForFields["title" + cardData?.id] = z.string()

    const formSchema = z.object(
        schemaForFields
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    if (cardData && cardIdsLoaded.find(i => i === cardData.id) === undefined) {
        cardIdsLoaded.push(cardData.id)

        cardData.allTabsFieldInformation.forEach(item => {
            const dict = fieldIdAndType?.find(i => i.key === item.cardTemplateTabFieldId)
            if (dict) {
                const id = "a" + item.id
                switch (dict.value) {
                    case 'Text field':
                    case 'Text area':
                    case 'Drop down':
                        form.setValue(id, item.data)
                        break
                    case 'Date picker':
                        form.setValue(id, new Date(item.data))
                        break
                    case 'Check boxes':
                        form.setValue(id, item.data.split(","))
                        break
                    case 'Track Github branch':
                        const data = item.data.split(";")

                        form.setValue(id, {
                            repo: data[0],
                            branches: data[1]
                                .split(",")
                                .map(i => (
                                    {
                                        "title": i.split(":")[0],
                                        "branchName": i.split(":")[1]
                                    }
                                ))
                        }
                        )
                        break
                }
            }
        })
    }
    // console.log(form.getValues())

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // âœ… This will be type-safe and validated.
        console.log(values);
        fetch("/api/card/update/content", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
            }),
        })
    }

    const onError = (errors, e) => console.log(errors, e)

    if (!cardData)
        return null

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="h-[90vh] min-w-[90vw]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                        <Title form={form} fieldTypeData={cardData.title} name={"title" + cardData.id} />
                        <Tabs defaultValue={cardData.cardTemplate.tabs[0].name}>
                            <TabsList>
                                {cardData.cardTemplate.tabs.map(tab => {
                                    return <TabsTrigger value={tab.name}>{tab.name}</TabsTrigger>
                                })}
                            </TabsList>

                            {cardData.cardTemplate.tabs.map(tab => {
                                const fields = []
                                for (let y = 1; y <= tab.sizeY; y++) {
                                    for (let x = 1; x <= tab.sizeX; x++) {
                                        const tmp = tab.tabFields.find(i => i.posX === x && i.posY === y)
                                        if (!tmp) {
                                            fields.push(undefined)
                                            continue
                                        }

                                        // deep copy object to prevent changing original data because this component is
                                        // loaded twice so the wrong data could be loaded
                                        const templateField = JSON.parse(
                                            JSON.stringify(tmp)
                                        )

                                        // updates template field id to data field id 
                                        const id = cardData.allTabsFieldInformation
                                            .find(i => i.cardTemplateTabFieldId === templateField.id)

                                        if (id) {
                                            templateField.id = id?.id
                                        }
                                        fields.push(templateField)
                                    }
                                }
                                return <TabsContent value={tab.name}>
                                    <div className={"grid grid-cols-" + tab.sizeX + " gap-10"}>
                                        {fields.map(field => {
                                            if (!field) {
                                                return <div />
                                            }
                                            switch (field.fieldType.name) {
                                                case 'Text field':
                                                    return <TextField form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id} />
                                                case 'Text area':
                                                    return <TextArea form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id} />
                                                case 'Date picker':
                                                    return <DatePicker form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id} />
                                                case 'Check boxes':
                                                    return <CheckboxMultiple form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id} />
                                                case 'Drop down':
                                                    return <ComboboxForm form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id} />
                                                case 'Track Github branch':
                                                    return <GitHubBranchTracker form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id} />
                                            }
                                            return <p></p>
                                        })}
                                    </div>
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
        case 'Track Github branch':
            return z.object({
                repo: z.string(),
                branches: z.array(
                    z.object({
                        title: z.string(),
                        branchName: z.string(),
                    })
                )
            }).transform(i => i.repo + ";" + 
                i.branches.flatMap(j => j.title + ":" + j.branchName).join(","))
        default:
            return z.string() // should probs be returning error instead
    }
}
