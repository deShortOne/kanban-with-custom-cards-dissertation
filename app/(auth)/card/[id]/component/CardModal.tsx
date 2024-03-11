'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import update from 'immutability-helper'

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DataProp, FieldTypeProp } from "./Base";
import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image";
import { DefaultDate } from "./card-modal-components/DefaultDate";
import { getRandomValues } from "crypto";

interface prop {
    data: string
    fieldType: FieldTypeProp
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp>>
    position: number[]
}

export const CardTemplateTabFieldModal = ({ data, fieldType, cardData, setData, position }: prop) => {
    const [openModal, setOpenModal] = useState(false);

    const splitData = data.split(";")
    const defaultValues: any = {
        label: splitData[0]
    }

    const fieldSchema: any = {
        label: z.string().min(1, "Please enter a title")
    }
    switch (fieldType.name) {
        case 'Text field':
        case 'Text area':
            fieldSchema["placeholder"] = z.string().optional()
            defaultValues["placeholder"] = splitData[1]

            fieldSchema["optional"] = z.boolean()
            defaultValues["optional"] = splitData[2] === "0"
            break;
        case 'Drop down':
        case 'Check boxes':
            fieldSchema["options"] = z.array(z.object({ value: z.string() })).min(1)
            const options = splitData[1]
                .split(",")
                .map(i => {
                    const val = i.split(":")
                    val.splice(0, 1)

                    return ({
                        value: val.join(":")
                    })
                })
            defaultValues["options"] = options

            fieldSchema["optional"] = z.boolean().default(false)
            defaultValues["optional"] = splitData[2] === "0"
            break
        case 'Date picker':
            fieldSchema["defaultDate"] = z.string()
                .refine(value => /(today|^$|(add|sub) \d+ (day|week|month|year)s?)/.test(value))

            defaultValues["defaultDate"] = splitData[1]

            fieldSchema["optional"] = z.boolean().default(false)
            defaultValues["optional"] = splitData[2] === "0"
            break
        case 'Track Github branch':
            break
    }

    const formSchema = z.object(
        fieldSchema
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const { control, register } = form;
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "options", // unique name for your Field Array
    });


    function onSubmit(values: z.infer<typeof formSchema>) {
        let dataToBeStored = values.label
        switch (fieldType.name) {
            case 'Text field':
            case 'Text area':
                dataToBeStored += ";"
                if (values.placeholder) {
                    dataToBeStored += values.placeholder
                }
                dataToBeStored += ";" + (values.optional ? 1 : 0)
                break;
            case 'Drop down':
            case 'Check boxes':
                dataToBeStored += ";"

                const listOfOptions = values.options
                const listOptions = listOfOptions.map((i: { value: string }, idx: number) => idx + ":" + i.value)
                dataToBeStored += listOptions.toString()

                dataToBeStored += ";" + (values.optional ? 1 : 0)
                break
            case 'Date picker':
                dataToBeStored += ";"
                if (values.defaultDate) {
                    dataToBeStored += values.defaultDate
                }
                dataToBeStored += ";" + (values.optional ? 1 : 0)
                break
            case 'Track Github branch':
                break
        }

        const newCardData = update(cardData, {
            tabs: {
                [position[0]]: {
                    tabFields: {
                        [position[1]]: {
                            data: {
                                $set: dataToBeStored
                            }
                        }
                    }
                }
            }
        })
        setData(newCardData)
        setOpenModal(false)
    }

    const onError = (errors: any, e: any) => console.log(errors, e)

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Image src="/setting.svg" alt="update field data" width={24} height={24} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[400px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                        <div className="flex justify-between">
                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title for this input</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            {"optional" in fieldSchema &&
                                <FormField
                                    control={form.control}
                                    name="optional"
                                    render={({ field }) => (
                                        <FormItem className="mx-5">
                                            <FormLabel>Optional input</FormLabel>
                                            <br />
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            }
                        </div>
                        {"placeholder" in fieldSchema &&
                            <FormField
                                control={form.control}
                                name="placeholder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Place holder</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Place holder" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        }
                        {"defaultDate" in fieldSchema && <DefaultDate defaultDate={form.getValues("defaultDate")} />}
                        {
                            "options" in fieldSchema &&
                            <div className="">
                                {fields.map((field, index) => (
                                    <div className="flex" key={field.id}>
                                        <input
                                            key={field.id}
                                            {...register(`options.${index}.value`)}
                                            className="my-1"
                                        />
                                        <button onClick={() => remove(index)}>
                                            <Image
                                                src="/delete.svg"
                                                alt="remove option"
                                                width={24}
                                                height={24}
                                            />
                                        </button>
                                    </div>
                                ))}
                                <Button onClick={() => append({})} type="button">Add</Button>
                            </div>
                        }
                        <Button
                            type="submit"
                            className="bg-cyan-500"
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
