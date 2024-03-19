-- CreateTable
CREATE TABLE `TrackChanges` (
    `timestamp` BIGINT NOT NULL,
    `dataCenterId` INTEGER NOT NULL,
    `machineId` INTEGER NOT NULL,
    `sequenceNumber` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `kanbanId` INTEGER NOT NULL,
    `updateCardPositions` BOOLEAN NOT NULL DEFAULT false,
    `updateColumnPositions` BOOLEAN NOT NULL DEFAULT false,
    `updateSwimLanePositions` BOOLEAN NOT NULL DEFAULT false,
    `updateCardTemplates` BOOLEAN NOT NULL DEFAULT false,
    `updateCardData` BOOLEAN NOT NULL DEFAULT false,
    `updatedCardId` INTEGER NULL,

    INDEX `TrackChanges_userId_idx`(`userId`),
    INDEX `TrackChanges_kanbanId_idx`(`kanbanId`),
    INDEX `TrackChanges_updatedCardId_idx`(`updatedCardId`),
    PRIMARY KEY (`timestamp`, `dataCenterId`, `machineId`, `sequenceNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
