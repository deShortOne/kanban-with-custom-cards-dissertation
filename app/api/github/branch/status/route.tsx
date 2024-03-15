import { getServerSession } from "next-auth"
import { OPTIONS } from "@/utils/authOptions"
import { createOAuthUserAuth } from '@octokit/auth-oauth-user'
import { Octokit } from "@octokit/rest"
import { CheckToken, CheckTokenReturnProp } from "../../TokenCheck"

export async function GET(request: Request) {
    const url = new URL(request.url)
    const ownerRepo = url.searchParams.get("ownerRepo")!
    const branch = url.searchParams.get("branch")!

    const ownerRepoSplit = ownerRepo.split("/")
    const owner = ownerRepoSplit[0]
    const repo = ownerRepoSplit[1]
    if (!owner || !repo || !branch) {
        return Response.json("Invalid data")
    }

    const session = await getServerSession(OPTIONS)
    if (!session?.user) {
        return Response.error()
    }
    const attemptToGetToken = await CheckToken({ githubId: session.user.id }) as CheckTokenReturnProp
    if (!attemptToGetToken.isGood) {
        return Response.json("Invalid token", { status: 498 })
    }

    const octokit = new Octokit({
        authStrategy: createOAuthUserAuth,
        auth: {
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            token: attemptToGetToken.token,
        },
    })

    let repoInfo;
    try {
        // check if repo exists
        repoInfo = await octokit.request("GET /repos/{owner}/{repo}", {
            owner: owner,
            repo: repo,
            branch: branch,
        })
    } catch (error: any) {
        if (error.status && error.status === 405) {
            return Response.json("Either repo no longer exists, you don't have access to the repo or authetication is not granted to access this repo (check GH repository access)")
        } else {
            throw error;
        }
    }
    const defaultBranch = repoInfo.data.default_branch;

    let branchInfo;
    try {
        // check if branch exists
        branchInfo = await octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
            owner: owner,
            repo: repo,
            branch: branch,
        })

    } catch (error: any) {
        if (error.status && error.status === 404) {
            return Response.json("Branch not found")
        } else {
            throw error;
        }
    }

    const { data: compareCommit } = await octokit.request("GET /repos/{owner}/{repo}/compare/{base}...{head}", {
        owner: owner,
        repo: repo,
        base: defaultBranch,
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
    }
    if (getPulls[0].merged_at === null) {
        return Response.json("Pull request denied")
    }

    if (getPulls[0].base.ref === defaultBranch) {
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

    return Response.json("Not yet implemented. Should not have been reached, plz report")
}
