-- CreateTable
CREATE TABLE `ActiveCardTypes` (
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `version` INTEGER NOT NULL,
    `cardTypeId` INTEGER NOT NULL,
    `kanbanId` INTEGER NOT NULL,

    INDEX `ActiveCardTypes_cardTypeId_idx`(`cardTypeId`),
    INDEX `ActiveCardTypes_kanbanId_idx`(`kanbanId`),
    UNIQUE INDEX `ActiveCardTypes_version_cardTypeId_kanbanId_key`(`version`, `cardTypeId`, `kanbanId`),
    PRIMARY KEY (`cardTypeId`, `kanbanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CardTemplate_version_cardTypeId_kanbanId_key` ON `CardTemplate`(`version`, `cardTypeId`, `kanbanId`);

-- InsertData - active card types
INSERT INTO ActiveCardTypes
SELECT CardTemplate.isDefault,
    T1.version,
	T1.cardTypeId,
	T1.kanbanId
FROM (
	SELECT cardTypeId,
		kanbanId,
		max(version) AS version
	FROM CardTemplate
	GROUP BY cardTypeId,
		kanbanId
	) T1
INNER JOIN CardTemplate
	ON CardTemplate.version = T1.version
		AND CardTemplate.cardTypeId = T1.cardTypeId
		AND CardTemplate.kanbanId = T1.kanbanId;

/*
  Warnings:

  - You are about to drop the column `isDefault` on the `CardTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CardTemplate` DROP COLUMN `isDefault`;
