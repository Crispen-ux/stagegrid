-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "eventDate" DATE,
    "venue" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuilderQuote" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "configuration" JSONB NOT NULL,
    "recommendation" JSONB NOT NULL,
    "basket" JSONB NOT NULL,
    "estimateTotal" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BuilderQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuilderConfig" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "label" TEXT,
    "configuration" JSONB NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuilderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuoteRequest_reference_key" ON "QuoteRequest"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "BuilderQuote_reference_key" ON "BuilderQuote"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "BuilderConfig_reference_key" ON "BuilderConfig"("reference");

