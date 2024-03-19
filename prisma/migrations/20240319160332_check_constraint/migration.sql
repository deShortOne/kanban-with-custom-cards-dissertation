-- AlterTable to add check constraints
ALTER TABLE `TrackChanges` 
    ADD CONSTRAINT `CHK_IncludeCardId` 
        CHECK (`updateCardData` = TRUE AND `updatedCardId` IS NOT NULL OR
            `updateCardData` = FALSE AND `updatedCardId` IS NULL);
