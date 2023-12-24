import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

const SelectKanbanPage = async ({
    params
} : {
    params: { id: string }
}) => {
    if (!params.id) {
        redirect("/select-board")
    }

    const kanban = await prisma.kanban.findUnique({
        where:{
            id: parseInt(params.id)
        }
    })

    if (!kanban) {
        return (
            <main>
                Kanban not found!
            </main>
        )
    }
    
    return (
        <main className="">
            {kanban.id} {kanban.title}
        </main>
    )
}

export default SelectKanbanPage;
