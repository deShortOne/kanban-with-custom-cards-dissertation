import { Badge } from "@/components/ui/badge"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { CardProps } from "../Table"

export const CardClassName = "border-solid border-2 border-[#ccc] cursor-move w-[200px] h-[100px] m-1"

export const CardDisplay = ({ title, cardTemplate }: CardProps) => {
    return (
        <CardHeader>
            <div className="flex justify-between">
                <CardTitle className="text-base">{title}</CardTitle>
                <Badge className="max-h-[24px]" variant="outline">{cardTemplate.cardType.name}</Badge>
            </div>
        </CardHeader>
    )
}
