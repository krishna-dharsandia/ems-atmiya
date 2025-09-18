-- CreateTable
CREATE TABLE "HackathonTemporaryInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "HackathonTemporaryInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HackathonTemporaryInvite_email_key" ON "HackathonTemporaryInvite"("email");

-- AddForeignKey
ALTER TABLE "HackathonTemporaryInvite" ADD CONSTRAINT "HackathonTemporaryInvite_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "HackathonTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
