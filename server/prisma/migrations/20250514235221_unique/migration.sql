/*
  Warnings:

  - A unique constraint covering the columns `[fileUrl]` on the table `Attachment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attachment_fileUrl_key" ON "Attachment"("fileUrl");
