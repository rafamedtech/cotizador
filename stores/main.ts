import { defineStore } from 'pinia';
import type Invoice from '@/types/invoice';

interface Credentials {
  email: string;
  password: string;
}

export const useStore = defineStore('main', () => {
  const invoiceDialog = ref(false);
  const modalActive = ref(false);
  const invoiceData = ref<Invoice[]>([]);
  const invoicesLoaded = ref(false);
  const currentInvoice = ref<Invoice | undefined>(undefined);
  const editInvoice = ref(false);
  const contactData = ref<any>([]);
  const customModal = ref(false);
  const modalType = ref('');

  // const errorMsg = ref("");

  const supabase = useSupabaseClient();
  const { auth } = useSupabaseAuthClient();

  const user = useSupabaseUser();

  const toggleInvoice = (): void => {
    invoiceDialog.value = !invoiceDialog.value;
  };

  const toggleModal = (): void => {
    modalActive.value = !modalActive.value;
  };

  const getInvoices = async () => {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .order('id', { ascending: true });
      invoiceData.value = invoices as Invoice[];

      invoiceData.value?.forEach((invoice: Invoice) => {
        const contact = {
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
  };

  const setCurrentInvoice = (payload: number) => {
    currentInvoice.value = invoiceData.value?.find((invoice: Invoice) => {
      return invoice.id === payload;
    });
  };

  const editCurrentInvoice = () => {
    editInvoice.value = !editInvoice.value;
  };

  const deleteInvoice = (payload: number) => {
    invoiceData.value = invoiceData.value?.filter(
      (invoice: any) => invoice.id !== payload
    ) as Invoice[];
  };

  const updateCurrentInvoice = async (payload: number) => {
    deleteInvoice(payload);
    await getInvoices();
    toggleInvoice();
    editCurrentInvoice();
    setCurrentInvoice(payload as number);
  };

  const deleteCurrentInvoice = async (docId: number) => {
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', docId);
      // console.log(data);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }

    deleteInvoice(docId);

    await navigateTo('/');
  };

  const updateStatusToPaid = async (payload: number): Promise<void> => {
    try {
      const statusFields = {
        invoicePending: false,
        invoiceDraft: false,
        invoicePaid: true,
      };

      const { error } = await supabase
        .from('invoices')
        .update(statusFields as never)
        .eq('id', payload);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
    invoiceData.value?.forEach((invoice: Invoice) => {
      if (invoice.id === payload) {
        invoice.invoicePaid = true;
        invoice.invoicePending = false;
        invoice.invoiceDraft = false;
      }
    });
  };

  const updateStatusToPending = async (payload: number): Promise<void> => {
    try {
      const statusFields = {
        invoicePending: true,
        invoiceDraft: false,
        invoicePaid: false,
      };

      const { error } = await supabase
        .from('invoices')
        .update(statusFields as never)
        .eq('id', payload);

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
    invoiceData.value?.forEach((invoice: Invoice) => {
      if (invoice.id === payload) {
        invoice.invoicePaid = false;
        invoice.invoicePending = true;
        invoice.invoiceDraft = false;
      }
    });
  };

  const userLogin = async ({ email, password }: Credentials): Promise<void> => {
    try {
      const { error } = await auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  };

  const userLogout = async () => {
    try {
      const { error } = await auth.signOut();

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }

    // const { error } = await auth.signOut();
    // if (error) {
    //   console.error(error);
    // }

    try {
      await $fetch('/api/_supabase/session', {
        method: 'POST',
        body: { event: 'SIGNED_OUT', session: null },
      });
      user.value = null;
    } catch (error) {
      console.error(error);
    }

    await navigateTo('/login');
  };

  // const fetchUser = () => {
  //   auth.onAuthStateChanged(async (fetchedUser) => {
  //     if (fetchedUser === null) {
  //       user.value = null;
  //     } else {
  //       user.value = fetchedUser;

  //       if (router.isReady() && router.currentRoute.value.path === '/login') {
  //         router.push('/');
  //       }
  //     }
  //   });
  // };

  return {
    invoiceDialog,
    modalActive,
    invoiceData,
    contactData,
    invoicesLoaded,
    currentInvoice,
    editInvoice,
    customModal,
    modalType,
    toggleInvoice,
    toggleModal,
    getInvoices,
    setCurrentInvoice,
    editCurrentInvoice,
    deleteCurrentInvoice,
    updateCurrentInvoice,
    updateStatusToPaid,
    updateStatusToPending,
    userLogin,
    userLogout,
    // fetchUser,
  };
});
