/*
  Warnings:

  - You are about to drop the column `description` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `CardTemplateTabField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Card` DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `CardTemplateTabField` ADD COLUMN `isRequired` BOOLEAN NOT NULL DEFAULT false,
	ADD COLUMN `requiredErrorMessage` VARCHAR(191) NULL DEFAULT '',
	ADD COLUMN `title` VARCHAR(191) NOT NULL DEFAULT '';

-- UpdateData for entries with just the title or GitHub Branch Tracker
-- Seems like something shortens title;;; to just title
UPDATE CardTemplateTabField
SET title = data,
	isRequired = false,
	requiredErrorMessage = ''
WHERE length(data) - length(replace(data, ';', '')) = 0
	OR fieldTypeId = 8;

-- UpdateData, set title, isRequired and error msg for: TextField; TextArea; DatePicker;
-- CheckBoxes; DropDown
UPDATE CardTemplateTabField
SET title = substring_index(data, ';', 1),
	isRequired = substring_index(substring_index(data, ';', 3), ';', - 1),
	requiredErrorMessage = CASE 
		WHEN substring_index(substring_index(data, ';', 4), ';', - 1) = 'undefined'
			THEN ''
		ELSE substring_index(substring_index(data, ';', 4), ';', - 1)
		END
WHERE length(data) - length(replace(data, ';', '')) = 3
	AND fieldTypeId IN (1, 2, 3, 6, 7);

-- CreateTable
CREATE TABLE `CardTemplateTabFieldData` (
	`dataType` VARCHAR(191) NOT NULL,
	`data` VARCHAR(191) NOT NULL,
	`cardTemplateTabFieldId` INTEGER NOT NULL,
	INDEX `CardTemplateTabFieldData_cardTemplateTabFieldId_idx`(`cardTemplateTabFieldId`),
	UNIQUE INDEX `CardTemplateTabFieldData_dataType_cardTemplateTabFieldId_key`(`dataType`, `cardTemplateTabFieldId`)
	) DEFAULT CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- InsertData add placeholder for TextField and TextArea
INSERT INTO CardTemplateTabFieldData
SELECT 'placeholder',
	substring_index(substring_index(data, ';', 2), ';', - 1),
	id
FROM CardTemplateTabField
WHERE fieldTypeId IN (1, 2);

-- InsertData add default date for DatePicker
INSERT INTO CardTemplateTabFieldData
SELECT 'defaultDate',
	substring_index(substring_index(data, ';', 2), ';', - 1),
	id
FROM CardTemplateTabField
WHERE fieldTypeId = 3;

-- InsertData add checkbox and drop down options
-- Attempted to source file but it doesn't work
-- dataType will be option:position
-- data will be option_id:option_text
INSERT INTO CardTemplateTabFieldData (
	`cardTemplateTabFieldId`,
	`dataType`,
	`data`
	)
SELECT T2.id cardTemplateTabFieldId,
	CONCAT (
		"option:",
		T3.position
		) dataType,
	CASE 
		WHEN T3.position = 1
			AND T2.num_items >= T3.position
			THEN T2.A
		WHEN T3.position = 2
			AND T2.num_items >= T3.position
			THEN T2.B
		WHEN T3.position = 3
			AND T2.num_items >= T3.position
			THEN T2.C
		WHEN T3.position = 4
			AND T2.num_items >= T3.position
			THEN T2.D
		ELSE ''
		END data
FROM (
	-- Get id, the options (I've only got max of 4 but expand if needed)
	-- Get the number of items
	SELECT id,
		substring_index(substring_index(data, ',', 1), ',', - 1) A,
		substring_index(substring_index(data, ',', 2), ',', - 1) B,
		substring_index(substring_index(data, ',', 3), ',', - 1) C,
		substring_index(substring_index(data, ',', 4), ',', - 1) D,
		length(data) - length(replace(data, ',', '')) + 1 num_items
	FROM (
		-- Get the options from checkboxes and drop downs
		SELECT id,
			substring_index(substring_index(data, ';', 2), ';', - 1) AS data
		FROM CardTemplateTabField
		WHERE fieldTypeId IN (6, 7)
		) T1
	) T2
-- Cross join so that we can rotate part of the table
-- From several columns to just the 3 we need
CROSS JOIN (
	SELECT 1 position
	UNION ALL
	SELECT 2
	UNION ALL
	SELECT 3
	UNION ALL
	SELECT 4
	) T3;

-- Delete empty data from CardTemplateTabFieldData
DELETE FROM `CardTemplateTabFieldData` WHERE data = ''; 

-- AlterTable
ALTER TABLE `CardTemplateTabField` DROP COLUMN `data`;
