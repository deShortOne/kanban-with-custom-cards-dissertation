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
import { GitHubBranchTracker } from "./field-type/GitHubBranchTracker/GitHubBranchTracker"
import Image from "next/image";

// This is used to check if fields for card has already been input
// Check is used to prevent overwriting of new user input
const cardIdsLoaded: number[] = []

export const CardModal = () => {
    const cardModal = useCardModal()
    const id = cardModal.id
    const isOpen = cardModal.isOpen
    const onClose = cardModal.onClose

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

    // stores information about the field template
    const fieldIdAndType = cardData?.cardTemplate
        .tabs
        .flatMap(i => i.tabFields)
        .map(i => ({ key: i.id, value: i.fieldType.name, data: i.data }))

    // converts field template id to actual data id
    const templateFieldIdToDataId: any = {}
    cardData?.allTabsFieldInformation.forEach(item => {
        const dict = fieldIdAndType?.find(i => i.key === item.cardTemplateTabFieldId)
        if (dict)
            templateFieldIdToDataId[dict.key] = item.id
    })

    const schemaForFields = fieldIdAndType ? fieldIdAndType
        .reduce((obj: any, item) => (
            obj["a" + templateFieldIdToDataId[item.key]] = fieldTypeToZodType(item.value, item.data), obj), {})
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
                        if (item.data !== "") {
                            form.setValue(id, new Date(item.data))
                        }
                        break
                    case 'Check boxes':
                        form.setValue(id, item.data.split(","))
                        break
                    case 'Track Github branch':
                        const data = item.data.split(";")

                        if (data.length === 2 && data[0] === "") {
                            form.setValue(id, {
                                repo: ""
                            })
                        } else {
                            const branchInfoLis = data[1] === "" || data[1] === undefined ? [] :
                                data[1].split(",")
                                    .map(i => (
                                        {
                                            "title": i.split(":")[0],
                                            "branchName": i.split(":")[1]
                                        }
                                    ))

                            form.setValue(id, {
                                repo: data[0],
                                branches: branchInfoLis
                            })
                            break
                        }
                }
            }
        })
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // âœ… This will be type-safe and validated.
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

    const onError = (errors: any, e: any) => console.log(errors, e)

    const deleteCard = (id: number) => {
        const cardDeleteConfirmMessage = "Are you sure you want to delete this card?\nThis action is irreversable!"

        if (confirm(cardDeleteConfirmMessage)) {
            cardModal.setDeletedId(id)
            onClose()
        }
    }

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
                        <div className="flex justify-between">
                            <Title form={form} fieldTypeData={cardData.title} name={"title" + cardData.id} />

                            <div className="flex px-5">
                                <Button type="submit" className="bg-cyan-500">Save</Button>
                                <Button type="button" className="bg-rose-600" onClick={() => deleteCard(id!)}>
                                    <Image
                                        src="/delete.svg"
                                        alt="delete card"
                                        width={24}
                                        height={24}
                                        className="invert dark:invert-0"
                                    />
                                </Button>
                            </div>
                        </div>

                        <Tabs defaultValue={cardData.cardTemplate.tabs[0].name} key={"lol i dunno"}>
                            <TabsList>
                                {cardData.cardTemplate.tabs.map(tab => {
                                    return <TabsTrigger value={tab.name} key={tab.name}>{tab.name}</TabsTrigger>
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
                                            templateField.id = id.id
                                        }

                                        fields.push(templateField)
                                    }
                                }
                                return <TabsContent value={tab.name} key={tab.name}>
                                    <div className={"grid grid-cols-" + tab.sizeX + " gap-10"}>
                                        {fields.map((field, index) => {
                                            if (!field) {
                                                return <div key={index + tab.name} />
                                            }
                                            switch (field.fieldType.name) {
                                                case 'Text field':
                                                    return <TextField form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id}
                                                        key={field.id} />
                                                case 'Text area':
                                                    return <TextArea form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id}
                                                        key={field.id} />
                                                case 'Date picker':
                                                    return <DatePicker form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id}
                                                        key={field.id} />
                                                case 'Check boxes':
                                                    return <CheckboxMultiple form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id}
                                                        key={field.id} />
                                                case 'Drop down':
                                                    return <ComboboxForm form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id}
                                                        key={field.id} />
                                                case 'Track Github branch':
                                                    return <GitHubBranchTracker form={form}
                                                        fieldTypeData={field.data}
                                                        name={"a" + field.id}
                                                        key={field.id} />
                                            }
                                            return <p key={index + tab.name}>Field not implemented!</p>
                                        })}
                                    </div>
                                </TabsContent>
                            })}
                        </Tabs>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

function fieldTypeToZodType(fieldType: string, data: string) {
    const temp = data.split(";")
    const optional = temp[2] === "0"

    switch (fieldType) {
        case 'Text field':
        case 'Text area':
            if (optional)
                return z.string().optional()
            if (temp[3] != "")
                return z.string().min(1, temp[3])
            return z.string().min(1)
        case 'Date picker':
            if (optional)
                return z.date().optional()
            if (temp[3] != "")
                return z.string().min(1, temp[3])
            return z.date()
        case 'Check boxes':
            if (optional)
                return z.array(z.string()).optional()
            if (temp[3] != "")
                return z.array(z.string()).refine((value) => value.some((item) => item), {
                    message: temp[3],
                })
            return z.array(z.string()).refine((value) => value.some((item) => item), {
                message: "You have to select at least one item.",
            })
        case 'Drop down':
            if (optional)
                return z.string().optional()
            if (temp[3] != "")
                return z.string({
                    required_error: temp[3],
                }).min(1, {
                    message: temp[3]
                })
            return z.string({
                required_error: "You have to select at least one item.",
            }).min(1, {
                message: "You must select an item"
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
