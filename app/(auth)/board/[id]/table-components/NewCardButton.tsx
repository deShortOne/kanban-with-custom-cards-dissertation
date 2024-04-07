import {
    ChevronDownIcon,
    Pencil2Icon
} from "@radix-ui/react-icons"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { useKanbanModalSetting } from "../settings-modal/components/useDialog"
import { Badge } from "@/components/ui/badge"
import { Role } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

interface NewCardInfo {
    id: number
    name: string
    isDefault: boolean
    cardType: { name: string }
}

export const AddNewCardButton = (
    { kanbanId, role, newCardAction }:
        {
            kanbanId: number
            role: Role
            newCardAction: (cardTemplateId: number, cardTypeName: string) => void
        }
) => {
    const kanbanSettingModal = useKanbanModalSetting()

    const [defaultNewCard, setDefaultNewCard] = useState<NewCardInfo>()

    const { status, data, error, isFetching } = useQuery<NewCardInfo[]>({
        queryKey: ['addNewCard'],
        queryFn: () => (fetch('/api/board/settings/card?' +
            new URLSearchParams({
                "kanbanId": kanbanId.toString(),
            }), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())),
    })

    useEffect(() => {
        if (isFetching)
            return
        if (!data)
            return
        for (let i = 0; i < data.length; i++) {
            if (data[i].isDefault) {
                setDefaultNewCard(data[i])
                break
            }
        }
    }, [isFetching, data])

    if (isFetching) {
        return (
            <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                <Button variant="secondary" className="px-3 shadow-none min-w-[150px]" disabled>
                    Loading cards
                </Button>
                <Separator orientation="vertical" className="h-[10px]" />
                <Button variant="secondary" className="px-2 shadow-none min-w-[60px]" disabled>
                    <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
            </div>
        )
    }

    if (!data) {
        return <div>error! Failed to fetch</div>
    }

    return (
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            {
                defaultNewCard
                    ?
                    <Button
                        id="btnCreateDefaultCard"
                        variant="secondary"
                        className="px-3 shadow-none min-w-[150px]"
                        onClick={() => newCardAction(defaultNewCard.id, defaultNewCard.cardType.name)}>
                        {defaultNewCard.name}
                    </Button>
                    :
                    <Button
                        variant="default"
                        className="px-3 shadow-none min-w-[150px]"
                        disabled>
                        No default card found
                    </Button>
            }

            <Separator orientation="vertical" className="h-[10px]" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        id="btnOpenAllCards"
                        variant="secondary"
                        className="px-2 shadow-none min-w-[60px]">
                        <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[220px]"
                    forceMount
                    id="divAllCardsDisplay"
                >
                    {data.map(type => {
                        return (
                            <DropdownMenuItem
                                className="justify-between"
                                onClick={() => newCardAction(type.id, type.cardType.name)}
                                key={type.id}
                            >
                                {type.name}
                                <Badge className="max-h-[24px]" variant="outline">{type.cardType.name}</Badge>
                            </DropdownMenuItem>
                        )
                    })}
                    {
                        role === Role.EDITOR &&
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                id="btnOpenEditCardTab"
                                onClick={() => kanbanSettingModal.onOpen("card")}
                            >
                                <Pencil2Icon className="mr-2 h-4 w-4" />Update cards
                            </DropdownMenuItem>
                        </>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
