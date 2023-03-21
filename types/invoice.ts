interface InvoiceItem {
  id: string;
  itemName: string;
  qty: string;
  partNo: string;
  price: string;
  total: string;
}

interface Features {
  text: string;
  image?: string;
}

export default interface Invoice {
  id: number;
  created_at: Date;
  clientCompany: string;
  clientName: string;
  clientName2?: string;
  clientEmail: string;
  clientEmail2?: string;
  currencyType: string;
  exchangeCost: number;
  eta: string;
  invoiceDateUnix: number;
  invoiceDate: string;
  paymentTerms: number;
  paymentDueDateUnix: number;
  paymentDueDate: string;
  condition: string;
  paymentType: string;
  notes: string;
  featureType?: string;
  features?: Features;
  invoiceItemList: InvoiceItem[];
  invoiceTax: number;
  invoiceSubtotal: number;
  invoiceTotal: number;
  invoicePending: boolean;
  invoiceDraft: boolean;
  invoicePaid: boolean;
}
