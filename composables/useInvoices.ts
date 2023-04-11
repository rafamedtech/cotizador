import type { InvoiceOutline } from '@/types/invoice';

export const useInvoices = async () => {
  const invoices = ref<InvoiceOutline[]>([]);
  async function getInvoices() {
    const { data, error } = await useFetch<InvoiceOutline[]>('/api/invoices');

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: 'Could not fetch data',
      });
    }

    invoices.value = data.value as InvoiceOutline[];
  }

  await getInvoices();

  return {
    invoices,
    getInvoices,
  };
};
