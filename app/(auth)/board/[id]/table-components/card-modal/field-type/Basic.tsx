import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldTypeProp } from "./Base"

export const TextField = ({ form, fieldTypeData, name }: FieldTypeProp) => {
    const splitData = fieldTypeData.split(";")
    const label = splitData[0]
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

export const TextArea = ({ form, fieldTypeData, name }: FieldTypeProp) => {
    const splitData = fieldTypeData.split(";")
    const label = splitData[0]
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

export const Title = ({ form, fieldTypeData, name }: FieldTypeProp) => {
    if (!form.getValues()[name])
        form.setValue(name, fieldTypeData)

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input placeholder="shadcn" {...field}
                            className="block w-5/6 p-4 text-gray-900 rounded-lg sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-background text-xl" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
