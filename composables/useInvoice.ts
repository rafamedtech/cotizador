import type { InvoiceWithItems, InvoiceDraft } from '@/types/invoice';

export const useInvoice = async (id?: string) => {
  const store = useStore();

  const { openAlert, alertType, alertMsg, isLoading } = storeToRefs(store);

  const currentInvoice = ref<InvoiceWithItems | null | undefined>(null);
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
  async function newInvoice(invoice: InvoiceDraft) {
    isLoading.value = true;
    try {
      await $fetch(`/api/cotizacion/new`, {
        method: 'POST',
        // Automatically stringified by ofetch
        body: {
          invoice,
        },
      });

      setTimeout(() => {
        isLoading.value = false;
        openAlert.value = true;
        alertType.value = 'success';
        alertMsg.value = 'La cotización ha sido creada!';
      }, 1000);

      setTimeout(() => {
        openAlert.value = false;
        alertType.value = '';
        alertMsg.value = '';
      }, 4000);

      await navigateTo('/');
    } catch (error) {
      console.error(error);
      isLoading.value = false;
      openAlert.value = true;
      alertType.value = 'fail';
      alertMsg.value = error as string;
    }
  }

  // - Edit currentInvoice
  async function updateInvoiceOnDb(invoice: InvoiceDraft) {
    isLoading.value = true;
    try {
      await $fetch('/api/cotizacion/:id/update', {
        method: 'PUT',
        body: {
          invoice,
        },
      });

      setTimeout(() => {
        isLoading.value = false;
        openAlert.value = true;
        alertType.value = 'success';
        alertMsg.value = 'La cotización ha sido actualizada!';
      }, 1000);

      setTimeout(() => {
        openAlert.value = false;
        alertType.value = '';
        alertMsg.value = '';
      }, 4000);
    } catch (error) {
      console.error(error);
      isLoading.value = false;
      openAlert.value = true;
      alertType.value = 'fail';
      alertMsg.value = error as string;
    }
  }

  // Update invoice status
  async function updateStatusOnDb(invoice: InvoiceDraft | null | undefined) {
    try {
      await $fetch(`/api/cotizacion/${invoice?.id}/status`, {
        method: 'PUT',
        body: {
          invoice,
        },
      });

      isLoading.value = false;
      openAlert.value = true;
      alertType.value = 'success';
      alertMsg.value = `La cotización se actualizó a la etapa ${invoice?.status}!`;

      setTimeout(() => {
        openAlert.value = false;
        alertType.value = '';
        alertMsg.value = '';
      }, 3000);
    } catch (error) {
      console.error(error);
      isLoading.value = false;
      openAlert.value = true;
      alertType.value = 'fail';
      alertMsg.value = error as string;
    }
  }

  // - Delete currentInvoice
  async function deleteInvoiceOnDb(id: number | undefined) {
    isLoading.value = true;
    try {
      await $fetch(`/api/cotizacion/${id}/delete`, {
        method: 'DELETE',
        body: {
          id,
        },
      });

      setTimeout(() => {
        isLoading.value = false;
        openAlert.value = true;
        alertType.value = 'success';
        alertMsg.value = 'La cotización ha sido eliminada!';
      }, 1000);

      setTimeout(() => {
        openAlert.value = false;
        alertType.value = '';
        alertMsg.value = '';
      }, 4000);
    } catch (error) {
      console.error(error);
      isLoading.value = false;
      openAlert.value = true;
      alertType.value = 'fail';
      alertMsg.value = error as string;
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
