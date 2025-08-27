/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "telegramID" TEXT NOT NULL PRIMARY KEY,
    "activeTill" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("activeTill", "banned", "createdAt", "telegramID", "updatedAt") SELECT "activeTill", "banned", "createdAt", "telegramID", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_telegramID_key" ON "User"("telegramID");
CREATE INDEX "User_telegramID_idx" ON "User"("telegramID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
