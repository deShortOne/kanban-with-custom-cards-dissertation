import { getServerSession } from "next-auth"
import { OPTIONS } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'
import { Octokit } from "@octokit/rest"

export async function GET(request: Request) {
    const session = await getServerSession(OPTIONS)
    if (!session?.user?.email) {
        return Response.error()
    }
    const user = await prisma.user.findFirstOrThrow({
        where: {
            email: session.user.email
        }
    })

    const octokit = new Octokit({
        authStrategy: createOAuthUserAuth,
        auth: {
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            token: user?.token!,
        },
    })

    const url = new URL(request.url)
    const owner = url.searchParams.get("owner")!
    const repo = url.searchParams.get("repo")!
    const branch = url.searchParams.get("branch")!

    let branchInfo;
    try {
        // check if branch exists
        branchInfo = await octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
            owner: owner,
            repo: repo,
            branch: branch,
        })
    } catch (error) {
        if (error.status && error.status === 404) {
            return Response.json("Not found")
        } else {
            throw error;
        }
    }

    const { data: compareCommit } = await octokit.request("GET /repos/{owner}/{repo}/compare/main...{head}", {
        owner: owner,
        repo: repo,
        head: branch,
    })

    if (compareCommit.status === "behind") {
        return Response.json("Merged")
    }

    const { data: getPulls } = await octokit.request("GET /repos/{owner}/{repo}/pulls?state=all&head={owner}:{branch}", {
        owner: owner,
        repo: repo,
        branch: branch,
    })

    if (getPulls.length === 0) {
        return Response.json("In progress - no pull request opened")
    }

    if (getPulls[0].state === "open") {
        return Response.json("Open pull request")
    } else {
        if (getPulls[0].base.ref === "main") {
            if (getPulls[0].head.sha === branchInfo.data.commit.sha) {
                return Response.json("Merged squash")
            }

            const compareBranchWithPRCommit = await octokit.request("GET /repos/{owner}/{repo}/compare/{base}...{head}", {
                owner: owner,
                repo: repo,
                base: branch,
                head: getPulls[0].head.sha
            })

            if (compareBranchWithPRCommit.data.status === "behind") {
                return Response.json("Merged PR but additional commits added after")
            } else if (compareBranchWithPRCommit.data.status === "identical") {
                return Response.json("Merged squash identical") // might not need this
            }
        } else {
            const { data: compareCommitNotMain } = await octokit.request("GET /repos/{owner}/{repo}/compare/{base}...{head}", {
                owner: owner,
                repo: repo,
                head: branch,
                base: getPulls[0].base.ref
            })
        
            if (compareCommitNotMain.status === "behind") {
                return Response.json("Merged to branch " + getPulls[0].base.label)
            } else {
                return Response.json("Not yet implemented")
            }
        }
    }

    return Response.json("Not yet implemented. Should not have been reached")
}