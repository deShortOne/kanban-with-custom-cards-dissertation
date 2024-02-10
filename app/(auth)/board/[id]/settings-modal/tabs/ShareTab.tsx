import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { UserPermission } from "./Base"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { UserPermissionDropDown } from "../components/SettingsDropDown"

export const ShareTab = (kanbanId: number) => {
    const { register, handleSubmit } = useForm()
    const onSubmit = (data: any) => console.log(data)

    const { data: userPermissions } = useQuery<UserPermission[]>({
        queryKey: ["userPermission", kanbanId],
        queryFn: () => (fetch("/api/board/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: kanbanId,
            }),
        }).then((res) => res.json()))
    })

    return (
        <TabsContent value="share" className="max-w-96">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Table>
                    <TableBody>
                        {userPermissions?.map(i => {
                            return (
                                <TableRow>
                                    <TableCell>
                                        <Input
                                            {...register("useremail" + i.user.id)}
                                            value={i.user.email}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <UserPermissionDropDown
                                            userId={i.user.id}
                                            defaultValue={i.permission}
                                            register={register}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <input type="submit" value="Save" />
            </form>
        </TabsContent>
    )
}
