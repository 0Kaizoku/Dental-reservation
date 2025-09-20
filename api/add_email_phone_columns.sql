-- SQL Script to add Email and Phone columns to pop_personne table
-- Run this script if you need to manually add the columns to an existing database

-- Add Email column
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'pop_personne' AND COLUMN_NAME = 'Email Per')
BEGIN
    ALTER TABLE pop_personne ADD [Email Per] NVARCHAR(255) NULL;
    PRINT 'Email Per column added to pop_personne table';
END
ELSE
BEGIN
    PRINT 'Email Per column already exists in pop_personne table';
END

-- Add Phone column
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'pop_personne' AND COLUMN_NAME = 'Phone Per')
BEGIN
    ALTER TABLE pop_personne ADD [Phone Per] NVARCHAR(50) NULL;
    PRINT 'Phone Per column added to pop_personne table';
END
ELSE
BEGIN
    PRINT 'Phone Per column already exists in pop_personne table';
END

-- Verify the columns were added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'pop_personne' 
AND COLUMN_NAME IN ('Email Per', 'Phone Per')
ORDER BY COLUMN_NAME;
