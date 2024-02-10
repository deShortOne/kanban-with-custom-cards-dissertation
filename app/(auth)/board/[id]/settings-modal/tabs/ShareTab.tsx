import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { useQuery } from "@tanstack/react-query"
import { Permission, UserPermission } from "./Base"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { UserPermissionDropDown } from "../components/SettingsDropDown"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"

export const ShareTab = ({ id }: { id?: number }) => {
    const { register, handleSubmit, unregister } = useForm()

    const [userPermissions, setUserPermissions] = useState<UserPermission[]>([])
    const [negativeCounter, setNegativeCounter] = useState(-1)

    useQuery<UserPermission[]>({
        queryKey: ["userPermission", id],
        queryFn: () => (fetch("/api/board/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: id,
            }),
        }).then(async (res) => {
            const data = await res.json()
            setUserPermissions(data)
            return data
        }))
    })

    function onSubmit(data: any) {
        fetch("/api/board/settings/share", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: id,
                ...data
            }),
        })
    }

    const addNewUser = () => {
        const updatedList = [...userPermissions]
        updatedList.push({
            user: {
                id: negativeCounter,
                email: "",
            },
            permission: "VIEWER"
        })
        setUserPermissions(updatedList)
        setNegativeCounter(negativeCounter - 1)
    }

    const removeUser = (userId: number) => {
        const updatedList = [...userPermissions]
        const posOfUserToRemove = updatedList.findIndex(user => user.user.id === userId)
        updatedList.splice(posOfUserToRemove, 1)
        setUserPermissions(updatedList)

        // could just pass userPermissions list to api
        unregister(userId + "~useremail")
        unregister(userId + "~user")
    }

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
                                            {...register(i.user.id + "~useremail")}
                                            defaultValue={i.user.email}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <UserPermissionDropDown
                                            userId={i.user.id}
                                            defaultValue={i.permission}
                                            register={register}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => removeUser(i.user.id)}>
                                            <TrashIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <input type="submit" value="Save" />
            </form>
            <Button onClick={addNewUser}>Add new user</Button>
        </TabsContent>
    )
}
