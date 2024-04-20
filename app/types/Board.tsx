import { KanbanColumn, KanbanSwimLane } from "@prisma/client"

export interface BoardApiData {
    updateCardPositions: boolean
    Cards: CardProps[]

    updateColumnPositions: boolean
    KanbanColumns: KanbanColumn[]

    updateSwimLanePositions: boolean
    KanbanSwimLanes: KanbanSwimLane[]

    updateCardTemplates: boolean

    updateCardData: boolean
    updatedCardIds: number[]

    LastKanbanUpdate: number
}

export interface CardProps {
    id: number
    title: string
    order: number
    columnId: number
    swimLaneId: number
    cardTemplate: {
        cardType: {
            name: string,
        }
    }
}

export interface BaseCardTemplate {
    id: number
    name: string
}

export interface ActiveCardTemplate extends BaseCardTemplate {
    cardType: {
        id: number
        name: string
    }
    ActiveCardTypes: {
        isDefault: boolean
    }
}
