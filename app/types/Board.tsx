import { KanbanColumn, KanbanSwimLane } from "@prisma/client"

export type BoardHeaderType = "COLUMN" | "SWIMLANE"

export interface BoardApiData {
    updateCardPositions: boolean
    cards: CardProps[]

    updateColumnPositions: boolean
    kanbanColumns: KanbanColumn[]

    updateSwimLanePositions: boolean
    kanbanSwimLanes: KanbanSwimLane[]

    updateCardTemplates: boolean

    updateCardData: boolean
    updatedCardIds: number[]

    lastKanbanUpdate: number
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
    activeCardTypes: {
        isDefault: boolean
    }
}
