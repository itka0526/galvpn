-- CreateTable
CREATE TABLE "Key" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userTelegramID" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configFile" TEXT NOT NULL,
    "configFilePath" TEXT NOT NULL,
    CONSTRAINT "Key_userTelegramID_fkey" FOREIGN KEY ("userTelegramID") REFERENCES "User" ("telegramID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Key_id_userTelegramID_idx" ON "Key"("id", "userTelegramID");
