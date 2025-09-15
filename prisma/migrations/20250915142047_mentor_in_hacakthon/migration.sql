/*
  Warnings:

  - Added the required column `mentor` to the `HackathonTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mentor_mail` to the `HackathonTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HackathonTeam" ADD COLUMN     "mentor" TEXT NOT NULL,
ADD COLUMN     "mentor_mail" TEXT NOT NULL;
