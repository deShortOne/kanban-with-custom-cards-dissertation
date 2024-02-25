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

interface NewCardInfo {
    id: number
    name: string
    isDefault: boolean
    cardType: { name: string }
}

export const AddNewCardButton = (
    { kanbanId, newCardAction }:
        {
            kanbanId: number,
            newCardAction: (cardTemplateId: number, cardTypeName: string) => void
        }
) => {
    const kanbanSettingModal = useKanbanModalSetting()

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState<NewCardInfo[]>([])
    const [defaultNewCard, setDefaultNewCard] = useState<NewCardInfo>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idAndTypes = await fetch('/api/card/types?' +
                    new URLSearchParams({
                        kanbanId: kanbanId.toString(),
                    }), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const idAndTypesData = await idAndTypes.json()
                setData(idAndTypesData)
                setDefaultNewCard(idAndTypesData[0])
                idAndTypesData.forEach((i: NewCardInfo) => i.isDefault ? setDefaultNewCard(i) : null)

                setLoading(false)
            } catch (error) {
                console.error("Fetch error:", error)
            }
        }

        fetchData()
    }, [])

    if (isLoading) {
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

    return (
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            {
                defaultNewCard
                    ?
                    <Button
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
                    <Button variant="secondary" className="px-2 shadow-none min-w-[60px]">
                        <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    alignOffset={-5}
                    className="w-[220px]"
                    forceMount
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => kanbanSettingModal.onOpen("card")}>
                        <Pencil2Icon className="mr-2 h-4 w-4" /> Update cards
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
