-- AlterTable
ALTER TABLE "Hackathon" ADD COLUMN     "open_registrations" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "open_submissions" BOOLEAN NOT NULL DEFAULT true;
