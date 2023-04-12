import { defineStore } from 'pinia';

import type Contact from '@/types/contact';
import type { InvoiceOutline } from '~~/types/invoice';

export const useStore = defineStore('main', () => {
  const invoiceDialog = ref(false);
  const isLoading = ref(false);
  const isLoadingFull = ref(false);

  const invoicesLoaded = ref(false);
  const editInvoice = ref(false);
  const contactData = ref<Contact[]>([]);
  const modalActive = ref(false);
  const customModal = ref(false);
  const modalType = ref('');
  const notificationMsg = ref('');

  const filterResults = ref(true);
  const filteredInvoices = reactive<InvoiceOutline[]>([]);
  const searchQuery = ref('');
  const filterQuery = ref('Todas');

  function toggleInvoice() {
    invoiceDialog.value = !invoiceDialog.value;
  }

  function toggleModal() {
    modalActive.value = !modalActive.value;
  }

  function editCurrentInvoice() {
    editInvoice.value = !editInvoice.value;
  }

  return {
    searchQuery,
    filterQuery,
    filterResults,
    filteredInvoices,
    notificationMsg,
    isLoading,
    isLoadingFull,
    invoiceDialog,
    modalActive,
    contactData,
    invoicesLoaded,
    editInvoice,
    customModal,
    modalType,
    toggleInvoice,
    toggleModal,
    editCurrentInvoice,
  };
});
