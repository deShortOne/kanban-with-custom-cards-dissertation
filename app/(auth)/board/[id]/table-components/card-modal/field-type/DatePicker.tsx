"use client"

import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FieldTypeProp, requiredIndicator } from "./Base"
import { useFormContext } from "react-hook-form"
import { useState } from "react"

export function DatePicker({ fieldTypeData, name }: FieldTypeProp) {
    const form = useFormContext()
    const data = fieldTypeData.split(";")

    const isRequired = data[2] === "1"
    const label = data[0] + (isRequired ? requiredIndicator() : "")

    const [calendarOpen, setCalendarOpen] = useState(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col" role="datepicker">
                    <FormLabel>{label}</FormLabel>
                    <Popover
                        open={calendarOpen}
                        onOpenChange={setCalendarOpen}
                    >
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(event) => {
                                    field.onChange(event)
                                    setCalendarOpen(false)
                                }}
                            // disabled={(date) =>
                            //     date < new Date()
                            // }
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
