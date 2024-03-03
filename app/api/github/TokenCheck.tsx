import { prisma } from "@/lib/prisma"

interface prop {
    githubId: number
}

export interface CheckTokenReturnProp {
    isGood: boolean
    token?: string
    errorMessage?: string
}

export const CheckToken = async ({ githubId }: prop) => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
            githubId: githubId
        },
        include: {
            UserToken: true
        }
    })

    if (user.UserToken === null || user.UserToken.token === null) {
        return ({
            isGood: false,
            errorMessage: "No token found"
        })
    } else if (user.UserToken.expiresAt !== null && user.UserToken.expiresAt < new Date()) {
        return ({
            isGood: false,
            errorMessage: "Token expired"
        })
    }

    return ({
        isGood: true,
        token: user.UserToken.token
    })
}
