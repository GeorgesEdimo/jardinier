-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT,
    "purchaseDate" DATETIME,
    "notes" TEXT,
    "locationCity" TEXT,
    "locationCountry" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Plant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Image_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WateringSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER NOT NULL,
    "waterQuantityMl" INTEGER NOT NULL,
    "frequencyDays" INTEGER NOT NULL,
    "nextWateringAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WateringSchedule_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WaterLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER NOT NULL,
    "wateredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantityMl" INTEGER,
    "notes" TEXT,
    CONSTRAINT "WaterLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "plantId" INTEGER,
    "channel" TEXT NOT NULL,
    "subject" TEXT,
    "payload" TEXT,
    "status" TEXT NOT NULL,
    "sendAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Notification_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeatherCache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherCache_city_country_key" ON "WeatherCache"("city", "country");
