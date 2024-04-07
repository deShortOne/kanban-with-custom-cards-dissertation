'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function deleteKanbanBoard(formData: FormData) {
    await prisma.kanban.delete({
        where: {
            id: parseInt(formData.get("id") as string)
        }
    })

    return redirect(`/select-board`)
}
