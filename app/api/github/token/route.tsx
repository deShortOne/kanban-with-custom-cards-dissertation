import { GitHub, generateState } from "arctic"
import { cookies } from "next/headers"

const github = new GitHub(process.env.GITHUB_ID!, process.env.GITHUB_SECRET!)

export async function GET(request: Request) {
	const state = generateState()
	const url = await github.createAuthorizationURL(state)
    url.searchParams.set("redirect_uri", "http://localhost:3000/api/github/token/callback")

    cookies().set("github_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	})

    return Response.redirect(url)
}
