import { GitHub, generateState } from "arctic"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers"
import { OPTIONS } from "@/utils/authOptions"
import { prisma } from "@/lib/prisma"

const github = new GitHub(process.env.GITHUB_ID!, process.env.GITHUB_SECRET!)

export async function GET(request: Request) {
    const session = await getServerSession(OPTIONS)
    if (!session?.user) {
        return Response.error()
    }
    const user = await prisma.user.findFirstOrThrow({
        where: {
            githubId: session.user.id
        },
        include: {
            UserToken: true
        }
    })

    if (user.UserToken !== null && user.UserToken.expiresAt && user.UserToken.expiresAt > new Date()) {
        return Response.json("Ok")
    }

    const state = generateState()
    const url = await github.createAuthorizationURL(state)
    url.searchParams.set("redirect_uri", process.env.NEXTAUTH_URL + "/api/github/token/callback")

    cookies().set("github_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
    })

    return Response.redirect(url)
}
