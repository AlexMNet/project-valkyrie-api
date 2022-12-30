/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `Record` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Record_authorId_key" ON "Record"("authorId");
