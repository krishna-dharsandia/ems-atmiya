-- CreateEnum
CREATE TYPE "EventMode" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SESSION', 'WORKSHOP', 'WEBINAR', 'OTHER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'COMPLETED', 'CANCELLED', 'OTHER');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "key_highlights" TEXT[],
    "note" TEXT,
    "poster_url" TEXT NOT NULL,
    "mode" "EventMode" NOT NULL,
    "address" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "event_type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL,
    "registration_required" BOOLEAN NOT NULL,
    "registration_link" TEXT,
    "registration_limit" INTEGER,
    "recording_link" TEXT,
    "feedback_form_link" TEXT,
    "tags" TEXT[],
    "organizer_name" TEXT NOT NULL,
    "organizer_contact" TEXT,
    "speaker_name" TEXT,
    "speaker_bio" TEXT,
    "speaker_photo_url" TEXT,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "ticket_price" INTEGER,
    "current_registration_count" INTEGER NOT NULL DEFAULT 0,
    "feedback_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
