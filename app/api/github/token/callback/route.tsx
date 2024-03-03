import { cookies } from "next/headers"
import crypto from "node:crypto"
import { createAppAuth } from '@octokit/auth-app'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route"
import { GitHubAppUserAuthenticationWithExpiration } from "@octokit/auth-app"

export async function GET(request: Request): Promise<Response> {
    const session = await getServerSession(OPTIONS)
    if (!session?.user) {
        return NextResponse.error()
    }

    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const storedState = cookies().get("github_oauth_state")?.value ?? null
    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        })
    }

    // convert private key from PKCS#1 to PKCS#8 as as GH only accepts PKCS#8 (eventhough they gave the private key as PKCS#1)
    const privateKeyPkcs8 = crypto
        .createPrivateKey(process.env.GITHUB_PRIVATE_KEY!.split(String.raw`\n`).join('\n'))
        .export({
            type: "pkcs8",
            format: "pem",
        })

    const auth = createAppAuth({
        appId: 1,
        privateKey: privateKeyPkcs8 as string,
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
    })

    const userAuthentication = await auth({ type: "oauth-user", code: code }) as GitHubAppUserAuthenticationWithExpiration

    await prisma.userToken.update({
        where: {
            githubId: session.user.id
        },
        data: {
            token: userAuthentication.token,
            expiresAt: userAuthentication.expiresAt,
            refreshToken: userAuthentication.refreshToken,
            refreshExpiresAt: userAuthentication.refreshTokenExpiresAt,
        }
    })

    return new NextResponse(
        `<div>Token added successfully</div>
        <div>I'm yet to discover how to close this tab, so please close by yourself, sorry!</div>`,
        { status: 200, headers: { 'content-type': 'text/html' } }
    )
}
