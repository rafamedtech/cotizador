import { PrismaClient } from '@prisma/client';
import protectRoute from '@/server/utils/protectRoute';

const prisma = new PrismaClient();

export default defineEventHandler((event) => {
  protectRoute(event);
  return prisma.invoice.findMany({
    select: {
      invId: true,
      invoiceDate: true,
      clientCompany: true,
      invoiceTotal: true,
      status: true,
    },
    orderBy: [
      {
        invId: 'desc',
      },
    ],
  });
});
