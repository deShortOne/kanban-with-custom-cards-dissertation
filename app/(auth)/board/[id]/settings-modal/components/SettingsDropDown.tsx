"use client"
import { CardType } from "../tabs/Base"
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
        <select {...register("cardType" + cardType)} defaultValue={cardType}>
            {cardTypes.map(i => {
                return (
                    <option value={i.id}>{i.name}</option>
                )
            })}
        </select>
    )
}
