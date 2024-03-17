
const EPOCH = parseInt(process.env.EPOCH!)
const SEQUENCE_BITS = 5

const dataCenterId = parseInt(process.env.DATA_CENTER_ID!)
const machineId = parseInt(process.env.MACHINE_ID!)
let sequence = 0
let lastTimestamp = -1

interface TwitterSnowFlake {
    timestamp: number
    dataCenterId: number
    machineId: number
    sequenceNumber: number
}

export function generateTwitterSnowflake(): TwitterSnowFlake {
    let timestamp = (new Date()).getTime() - EPOCH

    if (timestamp === lastTimestamp) {
        sequence = (sequence + 1) % (1 << SEQUENCE_BITS)
        if (sequence === 0) {
            timestamp = waitForNextTimestamp(lastTimestamp)
        }
    } else {
        sequence = 0
    }

    lastTimestamp = timestamp

    return {
        timestamp: timestamp,
        dataCenterId: dataCenterId,
        machineId: machineId,
        sequenceNumber: sequence,
    }
}

const waitForNextTimestamp = (lastTimestamp: number) => {
    let timestamp = Date.now() - EPOCH
    while (timestamp <= lastTimestamp) {
        timestamp = Date.now() - EPOCH
    }
    return timestamp
}
