-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kanban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRoleKanban` (
    `userId` INTEGER NOT NULL,
    `kanbanId` INTEGER NOT NULL,
    `permission` ENUM('EDITOR', 'VIEWER') NOT NULL,

    INDEX `UserRoleKanban_userId_idx`(`userId`),
    INDEX `UserRoleKanban_kanbanId_idx`(`kanbanId`),
    PRIMARY KEY (`userId`, `kanbanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KanbanColumn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `boardId` INTEGER NOT NULL,

    INDEX `KanbanColumn_boardId_idx`(`boardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KanbanSwimLane` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `boardId` INTEGER NOT NULL,

    INDEX `KanbanSwimLane_boardId_idx`(`boardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FieldType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `implemented` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `cardTypeId` INTEGER NOT NULL,
    `kanbanId` INTEGER NOT NULL,

    INDEX `CardTemplate_cardTypeId_idx`(`cardTypeId`),
    INDEX `CardTemplate_kanbanId_idx`(`kanbanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardTemplateTab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `sizeX` INTEGER NOT NULL,
    `sizeY` INTEGER NOT NULL,
    `cardTemplateId` INTEGER NOT NULL,

    INDEX `CardTemplateTab_cardTemplateId_idx`(`cardTemplateId`),
    UNIQUE INDEX `CardTemplateTab_order_cardTemplateId_key`(`order`, `cardTemplateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardTemplateTabField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` VARCHAR(191) NOT NULL,
    `posX` INTEGER NOT NULL,
    `posY` INTEGER NOT NULL,
    `fieldTypeId` INTEGER NOT NULL,
    `cardTemplateTabId` INTEGER NOT NULL,

    INDEX `CardTemplateTabField_fieldTypeId_idx`(`fieldTypeId`),
    INDEX `CardTemplateTabField_cardTemplateTabId_idx`(`cardTemplateTabId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CardTabField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` VARCHAR(191) NOT NULL,
    `cardId` INTEGER NOT NULL,
    `cardTemplateTabFieldId` INTEGER NOT NULL,

    INDEX `CardTabField_cardId_idx`(`cardId`),
    INDEX `CardTabField_cardTemplateTabFieldId_idx`(`cardTemplateTabFieldId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `description` TEXT NULL,
    `columnId` INTEGER NOT NULL,
    `swimLaneId` INTEGER NOT NULL,
    `kanbanId` INTEGER NOT NULL,
    `cardTemplateId` INTEGER NOT NULL,

    INDEX `Card_columnId_idx`(`columnId`),
    INDEX `Card_swimLaneId_idx`(`swimLaneId`),
    INDEX `Card_kanbanId_idx`(`kanbanId`),
    INDEX `Card_cardTemplateId_idx`(`cardTemplateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
