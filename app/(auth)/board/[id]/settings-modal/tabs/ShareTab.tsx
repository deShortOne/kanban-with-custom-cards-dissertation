import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TabsContent } from "@/components/ui/tabs"


export const ShareTab = () => {
    return (
        <TabsContent value="share" className="max-w-96">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Nam1</TableCell>
                        <TableCell>
                            <Select defaultValue="edit">
                                <SelectTrigger className="ml-auto w-[110px]">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="edit">Can edit</SelectItem>
                                    <SelectItem value="view">Can view</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TabsContent>
    )
}