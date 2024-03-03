"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
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

export const ShareTab = ({ id }: { id: number }) => {
    const { register, handleSubmit, unregister, setValue } = useForm()

    const [userPermissions, setUserPermissions] = useState<UserPermission[]>([])
    const [negativeCounter, setNegativeCounter] = useState(-1)

    useQuery<UserPermission[]>({
        queryKey: ["userPermission", id],
        queryFn: () => (fetch("/api/board/settings/share?" +
            new URLSearchParams({
                kanbanId: id.toString(),
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
            permission: Permission.VIEWER
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
        <TabsContent value="share">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userPermissions?.map(i => {
                            return (
                                <TableRow key={i.user.id}>
                                    <TableCell>
                                        <Input
                                            {...register(i.user.id + "~useremail")}
                                            defaultValue={i.user.email}
                                            placeholder="email"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <UserPermissionDropDown
                                            userId={i.user.id}
                                            defaultValue={i.permission}
                                            setValue={setValue}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            onClick={() => removeUser(i.user.id)}>
                                            <TrashIcon width={24} height={24} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <div className="flex justify-between">
                    <Button onClick={addNewUser} variant={"secondary"}>
                        Add new user
                    </Button>
                    <Button type="submit" variant={"outline"}>Save</Button>
                </div>
            </form>
        </TabsContent>
    )
}
