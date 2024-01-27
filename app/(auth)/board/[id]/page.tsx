import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import React, { useState } from 'react'
import { Table } from "./components/Table"
import { Card, Kanban } from ".prisma/client"

const SelectKanbanPage = async ({
    params
}: {
    params: { id: string }
}) => {
    if (!params.id) {
        redirect("/select-board")
    }

    // const kanban = await prisma.kanban.findUnique({
    //     where:{
    //         id: parseInt(params.id)
    //     },
    //     include: {
    //         KanbanColumns: {
    //             include: {
    //                 cards: true
    //             }
    //         },
    //         KanbanSwimLanes: {
    //             include: {
    //                 cards: true
    //             }
    //         },
    //     }
    // }) as Kanban

    const cards = await prisma.card.findMany() as Card[]

    return (
        <main className="">
            <Table cards={cards}></Table>
        </main>
    )
}

export default SelectKanbanPage;
