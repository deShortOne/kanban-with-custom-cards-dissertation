import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import React, { useState } from 'react'
import { Table } from "./components/Table"
import { Kanban } from ".prisma/client"

const SelectKanbanPage = async ({
    params
}: {
    params: { id: string }
}) => {
    if (!params.id) {
        redirect("/select-board")
    }

    const kanban = await prisma.kanban.findUnique({
        where:{
            id: parseInt(params.id)
        }
    }) as Kanban

    return (
        <main className="">
            <Table kanban={kanban}></Table>
        </main>
    )
}

export default SelectKanbanPage;
