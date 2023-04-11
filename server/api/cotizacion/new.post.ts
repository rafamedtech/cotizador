import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { invoice } = await readBody(event);

  assertMethod(event, ['POST']);

  return prisma.invoice.create({
    include: {
      invoiceItem: true,
    },
    data: {
      ...invoice,
      invoiceItem: {
        create: [...invoice.invoiceItem],
      },
    },
  });
});
