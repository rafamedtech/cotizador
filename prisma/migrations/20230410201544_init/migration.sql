-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "invId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientCompany" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientName2" TEXT,
    "clientEmail" TEXT NOT NULL,
    "clientEmail2" TEXT,
    "currencyType" TEXT NOT NULL,
    "exchangeCost" DOUBLE PRECISION NOT NULL,
    "eta" TEXT NOT NULL,
    "invoiceDateUnix" TEXT NOT NULL,
    "invoiceDate" TEXT NOT NULL,
    "paymentTerms" INTEGER NOT NULL,
    "paymentDueDateUnix" TEXT NOT NULL,
    "paymentDueDate" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "featureType" TEXT NOT NULL,
    "invoiceTax" DOUBLE PRECISION NOT NULL,
    "invoiceSubtotal" DOUBLE PRECISION NOT NULL,
    "invoiceTotal" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT,
    "qty" INTEGER NOT NULL,
    "partNo" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "invoiceId" INTEGER NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invId_key" ON "Invoice"("invId");

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
