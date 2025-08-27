/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `EventFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventFeedback_userId_eventId_key" ON "EventFeedback"("userId", "eventId");
