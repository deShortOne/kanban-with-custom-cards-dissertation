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
import { useKanbanModal } from "../settings-modal/components/useDialog"

export const AddNewCardButton = (
    { kanbanId, newCardAction }:
        {
            kanbanId: number,
            newCardAction: (cardTypeId: number) => void
        }
) => {
    const kanbanSettingModal = useKanbanModal()

    const [data, setData] = useState<{ id: number, name: string }[]>([])

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

                const data = await idAndTypes.json()
                setData(data)
            } catch (error) {
                console.error("Fetch error:", error)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            <Button variant="secondary" className="px-3 shadow-none min-w-[150px]" onClick={() => newCardAction(1)}>
                New Task
            </Button>
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
                            <DropdownMenuItem onClick={() => newCardAction(type.id)}>
                                {type.name}
                            </DropdownMenuItem>
                        )
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => kanbanSettingModal.onOpen(kanbanId, "card")}>
                        <Pencil2Icon className="mr-2 h-4 w-4" /> Update cards
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
