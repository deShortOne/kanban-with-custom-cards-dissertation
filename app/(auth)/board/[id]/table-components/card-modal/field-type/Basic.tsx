import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldTypeProp, requiredIndicator } from "./Base"
import { useFormContext } from "react-hook-form"

export const TextField = ({ fieldTypeData, name }: FieldTypeProp) => {
    const form = useFormContext()
    const splitData = fieldTypeData.split(";")

    const isRequired = splitData[2] === "1"
    const label = splitData[0] + (isRequired ? requiredIndicator() : "")

    const placeHolder = splitData[1]

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeHolder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const TextArea = ({ fieldTypeData, name }: FieldTypeProp) => {
    const form = useFormContext()
    const splitData = fieldTypeData.split(";")

    const isRequired = splitData[2] === "1"
    const label = splitData[0] + (isRequired ? requiredIndicator() : "")

    const placeHolder = splitData[1]

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea placeholder={placeHolder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const Title = ({ name }: FieldTypeProp) => {
    const form = useFormContext()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormControl>
                        <Input placeholder="Insert title here" {...field}
                            className="block p-4 text-gray-900 rounded-lg sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-background text-xl" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
