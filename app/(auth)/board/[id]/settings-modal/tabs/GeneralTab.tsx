"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const GeneralTab = ({ id, title }: { id: number, title: string }) => {
    const formSchema = z.object({
        kanbanName: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kanbanName: title
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        fetch("/api/board/settings/general", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: id,
                ...values
            }),
        })
    }

    const onError = (errors: any, e: any) => console.log(errors, e)
    return (
        <TabsContent
            value="general"
            id="tabSettingGeneral"
            className="flex items-center justify-center"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="kanbanName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name of board" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Save</Button>
                </form>
            </Form>
        </TabsContent>
    )
}
