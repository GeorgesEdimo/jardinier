/*
  Warnings:

  - You are about to drop the column `payload` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "plantId" INTEGER,
    "channel" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sendAt" DATETIME,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringDays" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("channel", "createdAt", "id", "plantId", "sendAt", "status", "subject", "userId") SELECT "channel", "createdAt", "id", "plantId", "sendAt", "status", "subject", "userId" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
