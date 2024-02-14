import { cookies } from "next/headers"
import crypto from "node:crypto"
import { createAppAuth } from '@octokit/auth-app'
import { NextResponse } from "next/server"

export async function GET(request: Request): Promise<Response> {
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

    const userAuthentication = await auth({ type: "oauth-user", code: code })
    console.log(userAuthentication)

    return NextResponse.json("01")
}
