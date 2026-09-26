-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'client',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN "clientId" TEXT;

-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN "clientId" TEXT;

-- AlterTable
ALTER TABLE "BuilderQuote" ADD COLUMN "clientId" TEXT;

-- AlterTable
ALTER TABLE "BuilderConfig" ADD COLUMN "clientId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "ContactMessage_clientId_idx" ON "ContactMessage"("clientId");

-- CreateIndex
CREATE INDEX "QuoteRequest_clientId_idx" ON "QuoteRequest"("clientId");

-- CreateIndex
CREATE INDEX "BuilderQuote_clientId_idx" ON "BuilderQuote"("clientId");

-- CreateIndex
CREATE INDEX "BuilderConfig_clientId_idx" ON "BuilderConfig"("clientId");

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteRequest" ADD CONSTRAINT "QuoteRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuilderQuote" ADD CONSTRAINT "BuilderQuote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuilderConfig" ADD CONSTRAINT "BuilderConfig_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
