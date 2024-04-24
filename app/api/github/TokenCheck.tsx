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
            userToken: true
        }
    })

    if (user.userToken === null || user.userToken.token === null) {
        return ({
            isGood: false,
            errorMessage: "No token found"
        })
    } else if (user.userToken.expiresAt !== null && user.userToken.expiresAt < new Date()) {
        return ({
            isGood: false,
            errorMessage: "Token expired"
        })
    }

    return ({
        isGood: true,
        token: user.userToken.token
    })
}
