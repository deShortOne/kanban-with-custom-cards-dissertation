import { prisma } from "@/lib/prisma"
import { add, get } from "@/lib/redis"
import { OPTIONS } from "@/utils/authOptions"
import { getServerSession } from 'next-auth/next'

const EPOCH = parseInt(process.env.EPOCH!)
const SEQUENCE_BITS = 5

const dataCenterId = parseInt(process.env.DATA_CENTER_ID!)
const machineId = parseInt(process.env.MACHINE_ID!)

interface TwitterSnowFlake {
    timestamp: number
    dataCenterId: number
    machineId: number
    sequenceNumber: number
}

export async function insertNewKanban(kanbanId: number) {
    await addUpdate(kanbanId, "")
}
export async function insertUpdateCardPositions(kanbanId: number) {
    await addUpdate(kanbanId, "updateCardPosition")
}
export async function insertUpdateColumnPositions(kanbanId: number) {
    await addUpdate(kanbanId, "updateColumnPositions")
}
export async function insertUpdateSwimLanePositions(kanbanId: number) {
    await addUpdate(kanbanId, "updateSwimLanePositions")
}
export async function insertUpdateCardTemplates(kanbanId: number) {
    await addUpdate(kanbanId, "updateCardTemplates")
}
export async function insertUpdateCardData(kanbanId: number, cardId: number) {
    const session = await getServerSession(OPTIONS)
    const snow = await generateTwitterSnowflake()
    await prisma.trackChanges.create({
        data: {
            timestamp: snow.timestamp,
            dataCenterId: snow.dataCenterId,
            machineId: snow.machineId,
            sequenceNumber: snow.sequenceNumber,

            userId: session?.user.id!,
            kanbanId: kanbanId,
            updateCardData: true,
            updatedCardId: cardId,
        }
    })
}

async function addUpdate(kanbanId: number,
    type: "updateCardPosition" | "updateColumnPositions" | "updateSwimLanePositions" | "updateCardTemplates" | ""
) {
    const session = await getServerSession(OPTIONS)
    const snow = await generateTwitterSnowflake()
    await prisma.trackChanges.create({
        data: {
            timestamp: snow.timestamp,
            dataCenterId: snow.dataCenterId,
            machineId: snow.machineId,
            sequenceNumber: snow.sequenceNumber,

            userId: session?.user.id!,
            kanbanId: kanbanId,
            updateCardPositions: type == "updateCardPosition",
            updateColumnPositions: type == "updateColumnPositions",
            updateSwimLanePositions: type == "updateSwimLanePositions",
            updateCardTemplates: type == "updateCardTemplates",
        }
    })
}

async function generateTwitterSnowflake(): Promise<TwitterSnowFlake> {
    let timestamp = (new Date()).getTime() - EPOCH

    const lastTimestampTmp = await get("lastTimestamp")
    const lastTimestamp = lastTimestampTmp === null ? -1 : parseInt(lastTimestampTmp)

    const lastSequenceNumberTmp = await get("sequenceNumber")
    let lastSequenceNumber = lastSequenceNumberTmp === null ? 0 : parseInt(lastSequenceNumberTmp)
    if (timestamp === lastTimestamp) {
        lastSequenceNumber = (lastSequenceNumber + 1) % (1 << SEQUENCE_BITS)
        if (lastSequenceNumber === 0) {
            timestamp = waitForNextTimestamp(lastTimestamp)
        }
    } else {
        lastSequenceNumber = 0
    }

    await add("lastTimestamp", timestamp.toString())
    await add("sequenceNumber", lastSequenceNumber.toString())

    return {
        timestamp: timestamp,
        dataCenterId: dataCenterId,
        machineId: machineId,
        sequenceNumber: lastSequenceNumber,
    }
}

const waitForNextTimestamp = (lastTimestamp: number) => {
    let timestamp = Date.now() - EPOCH
    while (timestamp <= lastTimestamp) {
        timestamp = Date.now() - EPOCH
    }
    return timestamp
}
