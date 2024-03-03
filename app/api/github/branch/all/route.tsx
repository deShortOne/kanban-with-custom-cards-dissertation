import { getServerSession } from "next-auth"
import { OPTIONS } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'
import { Octokit } from "@octokit/rest"
import { CheckToken, CheckTokenReturnProp } from "../../TokenCheck"

export async function GET(request: Request) {
    const session = await getServerSession(OPTIONS)
    if (!session?.user) {
        return Response.error()
    }
    const attemptToGetToken = await CheckToken({ githubId: session.user.id }) as CheckTokenReturnProp
    if (!attemptToGetToken.isGood) {
        return Response.json("Invalid token", { status: 501 })
    }

    const octokit = new Octokit({
        authStrategy: createOAuthUserAuth,
        auth: {
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            token: attemptToGetToken.token,
        },
    })

    const url = new URL(request.url)
    const owner = url.searchParams.get("owner")!
    const repo = url.searchParams.get("repo")!

    const { data } = await octokit.request("GET /repos/{owner}/{repo}/branches", {
        owner: owner,
        repo: repo
    })

    const compressedData = data.map(i => i.name)

    return Response.json(compressedData)
}
