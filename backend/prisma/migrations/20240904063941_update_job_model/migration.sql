/*
  Warnings:

  - You are about to drop the `key_suggestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `preferred_skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requirements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `responsibilities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "key_suggestions" DROP CONSTRAINT "key_suggestions_jobId_fkey";

-- DropForeignKey
ALTER TABLE "preferred_skills" DROP CONSTRAINT "preferred_skills_jobId_fkey";

-- DropForeignKey
ALTER TABLE "requirements" DROP CONSTRAINT "requirements_jobId_fkey";

-- DropForeignKey
ALTER TABLE "responsibilities" DROP CONSTRAINT "responsibilities_jobId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "keySuggestions" TEXT[],
ADD COLUMN     "preferredSkills" TEXT[],
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "responsibilities" TEXT[];

-- DropTable
DROP TABLE "key_suggestions";

-- DropTable
DROP TABLE "preferred_skills";

-- DropTable
DROP TABLE "requirements";

-- DropTable
DROP TABLE "responsibilities";
