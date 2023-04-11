import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);

  assertMethod(event, ['PUT']);

  const items = await prisma.invoiceItem.deleteMany({
    where: {
      invoiceId: id,
    },
  });

  const invoice = await prisma.invoice.delete({
    where: {
      id: id,
    },
  });

  if (!invoice) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invoice not found',
    });
  }

  return {
    invoice,
    items,
  };
});
