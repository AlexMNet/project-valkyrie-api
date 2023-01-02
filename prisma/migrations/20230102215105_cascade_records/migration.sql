-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
