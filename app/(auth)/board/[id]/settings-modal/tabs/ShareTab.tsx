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
    const { register,
        handleSubmit,
        unregister,
        setValue,
        setError,
        formState: { errors },
    } = useForm<any>({
        reValidateMode: "onSubmit", // so errors don't get cleared when typing
    })

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

    async function onSubmit(data: any) {
        const lis = await fetch("/api/board/settings/share", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kanbanId: id,
                ...data
            }),
        })
        const response = await lis.json() as string[]
        for (let i = 0; i < response.length; i++) {
            setError(response[i] + '~useremail', { type: 'custom', message: "Invalid email" })
        }
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

    const onError = (errors: any, e: any) => console.log(errors, e)

    return (
        <TabsContent value="share">
            <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                                        {errors[i.user.id + "~useremail"] &&
                                            <p>{errors[i.user.id + "~useremail"]!.message as string}</p>
                                        }
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
                    <Button onClick={addNewUser} variant={"secondary"} type="button">
                        Add new user
                    </Button>
                    <Button type="submit" variant={"outline"}>Save</Button>
                </div>
            </form>
        </TabsContent >
    )
}
