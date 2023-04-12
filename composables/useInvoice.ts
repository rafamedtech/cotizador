import type { InvoiceOutline, InvoiceWithItems } from '@/types/invoice';

// export default async (id: string) => useFetchWithCache<InvoiceWithItems>('/api/cotizacion/:id');
export const useInvoice = async (id?: string) => {
  // const currentInvoice = await useFetchWithCache<InvoiceWithItems>('/api/cotizacion/:id');

  const currentInvoice = ref<InvoiceWithItems | null>(null);
  async function getCurrentInvoice(id: string) {
    const { data, error } = await useFetch<InvoiceWithItems>(`/api/cotizacion/${id}`);

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: 'Could not fetch data',
      });
    }

    currentInvoice.value = data.value as InvoiceWithItems;
  }

  if (id) {
    await getCurrentInvoice(id as string);
  }

  // - Create new invoice
  async function newInvoice(invoice: InvoiceWithItems) {
    try {
      await $fetch(`/api/cotizacion/new`, {
        method: 'POST',
        // Automatically stringified by ofetch
        body: {
          invoice,
        },
      });

      await navigateTo('/');
    } catch (error) {
      console.error(error);
    }
  }

  // - Edit currentInvoice
  async function updateInvoiceOnDb(invoice: InvoiceWithItems) {
    try {
      await $fetch('/api/cotizacion/:id/update', {
        method: 'PUT',
        body: {
          invoice,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Update invoice status
  /* TO-DO 
      - Create server endpoint
      - Create composable
  */

  async function updateStatusOnDb(invoice: InvoiceWithItems | null) {
    try {
      await $fetch(`/api/cotizacion/${invoice?.id}/status`, {
        method: 'PUT',
        body: {
          invoice,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  // - Delete currentInvoice
  async function deleteInvoiceOnDb(id: number) {
    try {
      await $fetch('/api/cotizacion/:id/delete', {
        method: 'DELETE',
        body: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return {
    currentInvoice,
    getCurrentInvoice,
    newInvoice,
    deleteInvoiceOnDb,
    updateInvoiceOnDb,
    updateStatusOnDb,
  };
};
