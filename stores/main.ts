import { defineStore } from 'pinia';
// import type { InvoiceWithItems } from '@/types/invoice';
import type Contact from '@/types/contact';
import { InvoiceOutline, InvoiceWithItems } from '~~/types/invoice';

export const useStore = defineStore('main', () => {
  const invoiceDialog = ref(false);
  const closeBtn = ref(null);
  const modalActive = ref(false);
  const invoicesLoaded = ref(false);
  const editInvoice = ref(false);
  // const currentInvoice = ref<Invoice | undefined>(undefined);
  // const invoiceData = ref<Invoice[]>([]);
  const contactData = ref<Contact[]>([]);
  const customModal = ref(false);
  const modalType = ref('');
  const notificationMsg = ref('');
  const isLoading = ref(false);

  const filterResults = ref(true);
  const filteredInvoices = reactive<InvoiceOutline[]>([]);

  const searchQuery = ref('');
  const filterQuery = ref('Todas');

  const supabase = useSupabaseClient();

  function toggleInvoice() {
    invoiceDialog.value = !invoiceDialog.value;
  }

  function toggleModal() {
    modalActive.value = !modalActive.value;
  }

  // function setCurrentInvoice(payload: string) {
  //   currentInvoice.value = invoiceData.value?.find((invoice: Invoice) => {
  //     return invoice.invoiceId?.toString() === payload.toString();
  //   });
  // }

  function editCurrentInvoice() {
    editInvoice.value = !editInvoice.value;
  }

  function deleteInvoice(payload: string) {
    invoiceData.value = invoiceData.value?.filter(
      (invoice: InvoiceWithItems) => invoice.invId !== payload
    );
  }

  async function updateCurrentInvoice(payload: number | string) {
    deleteInvoice(payload as string);
    await getInvoices();
    // toggleInvoice();
    editCurrentInvoice();
    setCurrentInvoice(payload as string);
  }

  async function deleteCurrentInvoice(docId: string) {
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', docId);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }

    deleteInvoice(docId);

    await navigateTo('/');
  }

  async function getInvoices() {
    // invoicesLoaded.value = false;
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('invoiceId', { ascending: false });

      invoiceData.value = data as InvoiceWithItems[];

      invoiceData.value?.forEach((invoice: InvoiceWithItems) => {
        const contact: Contact = {
          clientCompany: invoice.clientCompany,
          clientName: invoice.clientName,
          clientName2: invoice.clientName2,
          clientEmail: invoice.clientEmail,
          clientEmail2: invoice.clientEmail2,
        };
        contactData.value.push(contact);
      });

      invoicesLoaded.value = true;

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadToSupabase(invoice: InvoiceWithItems) {
    try {
      const { error } = await supabase.from('invoices').insert([invoice as never]);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    searchQuery,
    filterQuery,
    filterResults,
    filteredInvoices,
    notificationMsg,
    isLoading,
    invoiceDialog,
    closeBtn,
    modalActive,
    // invoiceData,
    contactData,
    invoicesLoaded,
    // currentInvoice,
    editInvoice,
    customModal,
    modalType,
    toggleInvoice,
    toggleModal,
    getInvoices,
    // setCurrentInvoice,
    editCurrentInvoice,
    deleteCurrentInvoice,
    updateCurrentInvoice,

    uploadToSupabase,
  };
});
