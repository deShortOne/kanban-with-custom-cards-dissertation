import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from "@/lib/prisma"

export const OPTIONS: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            const gitHubId = parseInt(user.id!)
            await prisma.user.upsert({
                where: {
                    githubId: gitHubId,
                },
                create: {
                    githubId: gitHubId,
                    email: user.email,
                },
                update: {

                }
            })

            const expiresAtDate = new Date(0)
            expiresAtDate.setUTCSeconds(account?.expires_at as number)
            const refreshExpiresAtDate = new Date(0)
            refreshExpiresAtDate.setUTCSeconds(account?.refresh_token_expires_in as number)

            await prisma.userToken.upsert({
                where: {
                    githubId: gitHubId,
                },
                create: {
                    githubId: gitHubId,
                    token: account?.access_token as string,
                    expiresAt: expiresAtDate,
                    refreshToken: account?.refresh_token as string,
                    refreshExpiresAt: refreshExpiresAtDate,
                },
                update: {
                    token: account?.access_token as string,
                    expiresAt: expiresAtDate,
                    refreshToken: account?.refresh_token as string,
                    refreshExpiresAt: refreshExpiresAtDate,
                }
            })
            return true
        },
        async session({ session, token }) {
            if (session?.user)
                session.user.id = parseInt(token.sub!)

            return session
        },
    }
}

const handler = NextAuth(OPTIONS)

export { handler as GET, handler as POST }
