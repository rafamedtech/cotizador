import type { Invoice, InvoiceItem } from '@prisma/client';

export type InvoiceWithItems = Invoice & {
  invoiceItem: InvoiceItem[];
};

export interface InvoiceOutline {
  invId: string;
  invoiceDate: string;
  clientCompany: string;
  invoiceTotal: number;
  status: string;
  clientName: string;
  clientName2: string;
  clientEmail: string;
  clientEmail2: string;
}
