/*
  Warnings:

  - You are about to drop the column `companions` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `desserts` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `drinks` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `mainCourse` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `starters` on the `Visit` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL,
    "visitId" INTEGER NOT NULL,
    CONSTRAINT "MenuItem_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "Visit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Companion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CompanionToVisit" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CompanionToVisit_A_fkey" FOREIGN KEY ("A") REFERENCES "Companion" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompanionToVisit_B_fkey" FOREIGN KEY ("B") REFERENCES "Visit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Visit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "rating" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Visit_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Visit" ("createdAt", "date", "id", "rating", "restaurantId", "updatedAt") SELECT "createdAt", "date", "id", "rating", "restaurantId", "updatedAt" FROM "Visit";
DROP TABLE "Visit";
ALTER TABLE "new_Visit" RENAME TO "Visit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Companion_name_key" ON "Companion"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CompanionToVisit_AB_unique" ON "_CompanionToVisit"("A", "B");

-- CreateIndex
CREATE INDEX "_CompanionToVisit_B_index" ON "_CompanionToVisit"("B");
