/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `EventRegistration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_userId_eventId_key" ON "EventRegistration"("userId", "eventId");
