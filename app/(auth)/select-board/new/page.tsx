"use client"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { submitFormAA } from "./action"
import { Input } from "@/components/ui/input"


const NewKanbanPage = () => {
    return (
        <main className="inline-flex items-center justify-center w-full h-[90vh]">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create kanban board</CardTitle>
                    <CardDescription>Deploy your new kanban board in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={submitFormAA}>
                        <div className="space-y-4">
                            <Input placeholder="Name" name="name" />
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}

export default NewKanbanPage;
