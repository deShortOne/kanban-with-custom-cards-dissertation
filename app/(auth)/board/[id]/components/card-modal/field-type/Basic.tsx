import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldTypeProp } from "./Base"

export const TextField = ({form, fieldTypeData, defaultValues, name}: FieldTypeProp) => {
    if (!form.getValues()[name])
        form.setValue(name, defaultValues[name])
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldTypeData}</FormLabel>
                    <FormControl>
                        <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export const TextArea = ({form, fieldTypeData, defaultValues, name}: FieldTypeProp) => {
    if (!form.getValues()[name])
        form.setValue(name, defaultValues[name])
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldTypeData}</FormLabel>
                    <FormControl>
                        <Textarea placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
