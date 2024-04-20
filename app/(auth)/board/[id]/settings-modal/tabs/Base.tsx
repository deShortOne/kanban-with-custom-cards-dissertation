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
