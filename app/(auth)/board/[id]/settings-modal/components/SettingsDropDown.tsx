"use client"
import { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { CardType, Permission } from "../tabs/Base"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

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
                    <option key={i.id} value={i.id}>{i.name}</option>
                )
            })}
        </select>
    )
}

interface userPermissionProp {
    userId: number
    defaultValue: Permission
    setValue: UseFormSetValue<FieldValues>
}

export const UserPermissionDropDown = ({ userId, defaultValue, setValue }: userPermissionProp) => {

    setValue(userId + "~user", defaultValue)

    return (
        <Select
            onValueChange={(val) => setValue(userId + "~user", val)}
            defaultValue={defaultValue.toString()}
        >
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value={"EDITOR"}>
                        Editor
                    </SelectItem>
                    <SelectItem value={"VIEWER"}>
                        Viewer
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
