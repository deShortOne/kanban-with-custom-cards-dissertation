import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export const OPTIONS: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.accessToken = account.accessToken
                token.id = profile.id
            }
            return token
        },
        async session({ session, token }) {
            if (session) {
                session.user.token = token.accessToken
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(OPTIONS)

export { handler as GET, handler as POST}