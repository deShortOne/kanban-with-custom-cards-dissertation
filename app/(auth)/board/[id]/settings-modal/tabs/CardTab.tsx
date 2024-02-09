import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TabsContent } from "@/components/ui/tabs"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"

export const CardTab = () => {

    const { register, handleSubmit } = useForm();
    const onSubmit = (data) => console.log(data)

    return (
        <TabsContent value="card">
            <form onSubmit={handleSubmit(onSubmit)}>
                <RadioGroup defaultValue="comfortable">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Default</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>

                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    <RadioGroupItem value="a" {...register("weather")} />
                                </TableCell>
                                <TableCell>
                                    <Input {...register("test")} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <img src="/setting.svg" />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </RadioGroup>
                <input type="submit" />
            </form>
        </TabsContent>
    )
}
