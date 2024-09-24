/*
  Warnings:

  - Made the column `departmentname` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "departmentname" SET NOT NULL,
ALTER COLUMN "departmentname" DROP DEFAULT;
