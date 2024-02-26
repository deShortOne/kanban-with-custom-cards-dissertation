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

interface prop {
    data: string
    fieldType: FieldTypeProp
    cardData: DataProp
    setData: Dispatch<SetStateAction<DataProp | undefined>>
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
                    <img src="/setting.svg" />
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
                        {"defaultDate" in fieldSchema &&
                            <div className="flex">
                                <FormField
                                    control={form.control}
                                    name="defaultDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex">
                                                <FormLabel className="inline-block align-bottom">Default date</FormLabel>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild className="h-[20px]">
                                                            <button type="button">
                                                                <img src="/help.svg" className="h-[20px]" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>There are 2 options</p>
                                                            <ul>
                                                                <li>Option 1 is today</li>
                                                                <li>Option 2 is made up of 3 parts</li>
                                                                <ul>
                                                                    <li>Part 1 is add or sub</li>
                                                                    <li>Part 2 is the number</li>
                                                                    <li>Part 3 is days, weeks, months or year</li>
                                                                </ul>
                                                                <li>Examples:</li>
                                                                <ul>
                                                                    <li>add 15 days</li>
                                                                    <li>sub 1 month</li>
                                                                    <li>add 1 year</li>
                                                                    <li>add 1 years</li>
                                                                </ul>
                                                            </ul>
                                                            <p>Currently case sensitive - all needs to be lowercase</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>

                                            <FormControl>
                                                <Input placeholder="today" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                            </div>
                        }
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
                                            <img src="/delete.svg" />
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
