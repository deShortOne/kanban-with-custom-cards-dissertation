export interface CardTemplate {
    id: number
    name: string
    version: number
    cardType: {
        id: number
        name: string
    }
    ActiveCardTypes: {
        isDefault: boolean
    }
}

export interface CardType {
    id: number
    name: string
}

export enum Permission {
    VIEWER = "VIEWER",
    EDITOR = "EDITOR"
}

export interface UserPermission {
    user: {
        id: number
        email: string
    }
    permission: Permission
}
