import { getServerSession } from "next-auth"
import { OPTIONS } from "@/utils/authOptions"
import { CheckToken } from "../../TokenCheck"

export async function GET() {
    const session = await getServerSession(OPTIONS)
    if (!session?.user) {
        return Response.error()
    }
    const attemptToGetToken = await CheckToken({ githubId: session.user.id })
    return Response.json(attemptToGetToken.isGood ? "connected" : "invalid token")
}
