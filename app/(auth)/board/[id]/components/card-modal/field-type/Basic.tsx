import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"

interface prop {
    form: UseFormReturn<{}, any, {}>,
    label: string,
    defaultValues: {},
    name: string
}

export const TextField = ({form, label, defaultValues, name}: prop) => {
    if (!form.getValues()[name])
        form.setValue(name, defaultValues[name])
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const TextArea = ({form, label, defaultValues, name}: prop) => {
    if (!form.getValues()[name])
        form.setValue(name, defaultValues[name])
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Textarea placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
