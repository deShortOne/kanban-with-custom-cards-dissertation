"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FieldTypeProp } from "./Base"

export const CheckboxMultiple = ({ form, fieldTypeData, name }: FieldTypeProp) => {

    const data = fieldTypeData.split(";")

    const label = data[0]
    const itemsA: string[][] = data[1].split(",").map(i => i.split(":"))

    const items: { id: string, label: string }[] = []
    for (let i = 0; i < itemsA.length; i++) {
        items.push({
            id: itemsA[i][0],
            label: itemsA[i][1]
        })
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={() => (
                <FormItem>
                    <FormLabel className="text-base">{label}</FormLabel>
                    {items.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name={name}
                            render={({ field }) => {
                                return (
                                    <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...field.value, item.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value: any) => value !== item.id
                                                            )
                                                        )
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            {item.label}
                                        </FormLabel>
                                    </FormItem>
                                )
                            }}
                        />
                    ))}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
