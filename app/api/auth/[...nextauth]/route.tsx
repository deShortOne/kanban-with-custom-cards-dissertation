import NextAuth from 'next-auth'
import { OPTIONS } from "@/utils/authOptions"

const handler = NextAuth(OPTIONS)

export { handler as GET, handler as POST }
