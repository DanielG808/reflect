-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('DRAFT', 'FINAL');

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "EntryStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entry_userId_idx" ON "Entry"("userId");

-- CreateIndex
CREATE INDEX "Entry_userId_status_idx" ON "Entry"("userId", "status");

-- CreateIndex
CREATE INDEX "Entry_updatedAt_idx" ON "Entry"("updatedAt");
