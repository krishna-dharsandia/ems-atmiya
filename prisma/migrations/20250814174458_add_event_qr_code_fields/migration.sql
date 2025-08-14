/*
  Warnings:

  - You are about to drop the column `qrCode` on the `EventRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `qrCodeData` on the `EventRegistration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "qrCodeData" TEXT;

-- AlterTable
ALTER TABLE "EventRegistration" DROP COLUMN "qrCode",
DROP COLUMN "qrCodeData";
