import { prisma } from "@/lib/prisma"


interface prop {
    email: string
}

export interface CheckTokenReturnProp {
    isGood: boolean
    token?: string
    errorMessage?: string
}

export const CheckToken = async ({ email }: prop) => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
            email: email
        }
    })

    if (user.token === null) {
        return ({
            isGood: false,
            errorMessage: "No token found"
        })
    } else if (user.expiresAt !== null && user.expiresAt < new Date()) {
        return ({
            isGood: false,
            errorMessage: "Token expired"
        })
    }

    return ({
        isGood: true,
        token: user.token
    })
}
