import { getServerSession } from "next-auth"
import { OPTIONS } from "@/utils/authOptions"
import { prisma } from "@/lib/prisma"
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'
import { Octokit } from "@octokit/rest"
import { CheckToken, CheckTokenReturnProp } from "../TokenCheck"

export async function GET() {
    const session = await getServerSession(OPTIONS)
    if (!session?.user) {
        return Response.error()
    }
    const user = await prisma.user.findFirstOrThrow({
        where: {
            githubId: session.user.id
        },
        include: {
            userToken: true,
        }
    })

    const attemptToGetToken = await CheckToken({ githubId: session.user.id }) as CheckTokenReturnProp
    if (!attemptToGetToken.isGood) {
        return Response.json("Invalid token", { status: 498 })
    }

    const octokit = new Octokit({
        authStrategy: createOAuthUserAuth,
        auth: {
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            token: user?.userToken?.token!,
        },
    })

    const { data } = await octokit.request("GET /user/repos")

    const compressedData = data.map(i => i.full_name)

    return Response.json(compressedData)
}
