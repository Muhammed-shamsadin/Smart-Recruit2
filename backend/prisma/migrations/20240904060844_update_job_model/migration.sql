-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "status" SET DEFAULT 'Pending',
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "posted" DROP NOT NULL;
