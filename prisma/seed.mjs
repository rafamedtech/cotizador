import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.invoice.create({
    data: {
      invId: '1',
      clientCompany: 'Render',
      clientName: 'Carlos Morales',
      clientName2: '',
      clientEmail: 'carlos@render.com',
      clientEmail2: '',
      currencyType: 'MX',
      exchangeCost: 0,
      eta: 'Inmediata',
      invoiceDateUnix: '1680655927925',
      invoiceDate: '4 abr 2023',
      paymentTerms: 1,
      paymentDueDateUnix: '1680742336997',
      paymentDueDate: '5 abr 2023',
      condition: 'nuevo',
      paymentType: 'Contado',
      notes: '',
      featureType: 'texto',
      invoiceItem: {
        create: [{ itemName: 'test item', qty: 0, partNo: '', price: 0, total: 0 }],
      },
      invoiceTax: 16.0,
      invoiceSubtotal: 100.0,
      invoiceTotal: 116.0,
      status: 'Borrador',
    },
  });
}

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
