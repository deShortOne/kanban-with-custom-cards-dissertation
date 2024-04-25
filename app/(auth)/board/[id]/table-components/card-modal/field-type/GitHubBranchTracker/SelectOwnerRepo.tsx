import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Dispatch, SetStateAction, useState } from "react"
import { FieldValues, UseFormSetValue } from "react-hook-form"


interface prop {
    name: string
    repo: string
    isDisabled: boolean

    setValue: UseFormSetValue<FieldValues>
    setTokenStatus: Dispatch<SetStateAction<"connecting" | "connected" | "invalid token">>
}

export const SelectOwnerRepo = ({ name, repo, isDisabled, setValue, setTokenStatus }: prop) => {
    const [repoData, setRepoData] = useState<string[]>([])
    const [errorMsg, setErrorMsg] = useState<string>()
    const openRepoDropDown = async () => {
        if (repoData.length !== 0) {
            return
        }

        const response = await fetch("/api/github/repo", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const res = await response.json()
        if (!response.ok) {
            setErrorMsg(res)
            setTokenStatus("invalid token")
        } else {
            setRepoData(res)
            setTokenStatus("connected")
        }
    }

    return (
        <div className="flex">
            <Select
                onValueChange={(val) => setValue(name + ".repo", val)}
                onOpenChange={() => { openRepoDropDown() }}
                defaultValue={repo}
                disabled={isDisabled}
            >
                <SelectTrigger className="w-96">
                    <SelectValue placeholder="Select repo" />
                </SelectTrigger>
                {
                    errorMsg ?
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={"ERROR MSG"}>
                                    {errorMsg}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        :
                        <SelectContent>
                            {
                                repoData.length === 0
                                    ?
                                    (
                                        <div>
                                            <SelectItem value={repo == "" ? "__" : repo}>
                                                {repo}
                                            </SelectItem>
                                            <Skeleton className="my-2 h-2 w-[250px]" />
                                            <Skeleton className="my-2 h-2 w-[250px]" />
                                        </div>
                                    )
                                    :
                                    <SelectGroup>
                                        {
                                            repoData.map(i =>
                                                <SelectItem value={i} key={i}>
                                                    {i}
                                                </SelectItem>
                                            )
                                        }
                                    </SelectGroup>
                            }
                        </SelectContent>
                }
            </Select>
        </div >
    )
}
