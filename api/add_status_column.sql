-- Add 'status' column to appointments table with default and backfill
IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'tab_RDV_patient' AND COLUMN_NAME = 'status'
)
BEGIN
  ALTER TABLE tab_RDV_patient ADD status NVARCHAR(20) NULL CONSTRAINT DF_tab_RDV_patient_status DEFAULT 'pending';
  -- Backfill any existing rows to 'pending' where status is null
  UPDATE tab_RDV_patient SET status = 'pending' WHERE status IS NULL;
END
GO
