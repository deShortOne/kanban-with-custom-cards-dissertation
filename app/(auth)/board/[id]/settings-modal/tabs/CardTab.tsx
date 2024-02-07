import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TabsContent } from "@/components/ui/tabs"

export const CardTab = () => {

    return (
        <TabsContent value="card">
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
                                <RadioGroupItem value="default" id="r1" />
                            </TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell className="text-right">
                                <img src="/setting.svg" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </RadioGroup>
        </TabsContent>
    )
}
