"use client"
import { CardType, Permission, UserPermission } from "../tabs/Base"
import { useQuery } from "@tanstack/react-query"

interface prop {
    cardType: number
    register: UseFormRegister<FieldValues>
}

export const CardTypeDropDown = ({ cardType, register }: prop) => {
    const { data: cardTypes } = useQuery<CardType[]>({
        queryKey: ["cardTypes"],
        queryFn: () => (fetch("/api/card/allTypes", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json()))
    })

    if (!cardTypes)
        return <p>Card type list cannot load - {cardType}</p>

    return (
        <select {...register(cardType + "-cardType")} defaultValue={cardType}>
            {cardTypes.map(i => {
                return (
                    <option value={i.id}>{i.name}</option>
                )
            })}
        </select>
    )
}

interface userPermissionProp {
    userId: number
    defaultValue: Permission
    register: UseFormRegister<FieldValues>
}

export const UserPermissionDropDown = ({ userId, defaultValue, register }: userPermissionProp) => {

    return (
        <select {...register("user" + userId)} defaultValue={defaultValue}>
            <option value="EDITOR">Editor</option>
            <option value="VIEWER">Viewer</option>
        </select>
    )
}
