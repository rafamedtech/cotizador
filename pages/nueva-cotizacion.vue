<script setup>
import useVuelidate from '@vuelidate/core';
import { required, email, maxLength, minValue, helpers } from '@vuelidate/validators';

// Definitions
const store = useStore();
const {
  isLoading,
  isLoadingFull,
  invoiceDialog,
  invoicesLoaded,
  editInvoice,
  filterResults,
  filteredInvoices,
} = storeToRefs(store);

const { editCurrentInvoice, toggleModal, toggleInvoice, uploadToSupabase } = store;

isLoading.value = false;

setTimeout(() => {
  isLoadingFull.value = false;
}, 1000);

const { params } = useRoute();
const { id } = params;

const { invoices } = await useInvoices();
// const currentInvoice = ref(null);
const { contactData } = storeToRefs(store);

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const modal = ref(null);
const statusModal = ref(false);

const invoiceObject = reactive({
  invId: invoices.value.length + 1,
  clientCompany: '',
  clientName: null,
  clientName2: null,
  clientEmail: null,
  clientEmail2: null,
  currencyType: 'MX',
  exchangeCost: 0,
  eta: 'Inmediata',
  notes: '',
  invoiceDate: null,
  invoiceDateUnix: null,
  paymentTerms: 0,
  paymentDueDate: null,
  paymentDueDateUnix: null,
  condition: '',
  paymentType: '',
  featureType: 'texto',
  invoiceItem: [{ itemName: '', qty: 1, partNo: '', price: 0, total: 0 }],
  status: 'Borrador',
});

// Contacts autocomplete

const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map((clientCompany) => {
    return contactData.value.find((a) => a.clientCompany === clientCompany);
  })
);

const filteredContacts = ref([]);
const contactsModal = ref(false);

const filterContacts = () => {
  if (invoiceObject.clientCompany.length === 0) {
    filteredContacts.value = uniqueContacts.value;
  }

  filteredContacts.value = uniqueContacts.value.filter((contact) => {
    return contact.clientCompany
      .toLowerCase()
      .startsWith(invoiceObject.clientCompany.toLowerCase());
  });
};

onMounted(() => {
  filterContacts();
});

const setContact = (contact) => {
  invoiceObject.clientCompany = contact.clientCompany;
  invoiceObject.clientName = contact.clientName;
  invoiceObject.clientEmail = contact.clientEmail;
  contactsModal.value = false;
};

function clearSearch() {
  invoiceObject.clientCompany = '';
  invoiceObject.clientName = '';
  invoiceObject.clientEmail = '';
  invoiceObject.clientName2 = '';
  invoiceObject.clientEmail2 = '';
}

const closeBtn = ref(null);

function changeStatusModal() {
  statusModal.value = true;
}

function changeStatus(status) {
  invoiceObject.status = status;
  statusModal.value = false;
}

// Invoice processing

const rules = computed(() => {
  return {
    clientCompany: { required: helpers.withMessage('Este campo es obligatorio', required) },
    clientName: { required: helpers.withMessage('Este campo es obligatorio', required) },
    clientEmail: {
      required: helpers.withMessage('Este campo es obligatorio', required),
      email: helpers.withMessage('Formato inválido', email),
    },
    clientEmail2: {
      email: helpers.withMessage('Formato inválido', email),
    },
    paymentTerms: { minValue: helpers.withMessage('Este campo es obligatorio', minValue(1)) },
    paymentType: { required: helpers.withMessage('Este campo es obligatorio', required) },
    condition: { required: helpers.withMessage('Este campo es obligatorio', required) },
    notes: {
      maxLength: helpers.withMessage('Solo se permite hasta 255 caracteres', maxLength(255)),
    },
  };
});
const v$ = useVuelidate(rules, invoiceObject);

// Totals processing

const invoiceSubtotal = computed(() => {
  let sum = 0;
  for (let i = 0; i < invoiceObject.invoiceItem.length; i++) {
    sum += Number(invoiceObject.invoiceItem[i].price * invoiceObject.invoiceItem[i].qty);
  }
  return sum;
});

const invoiceTax = computed(() => {
  return invoiceSubtotal.value * 0.16;
});

const invoiceTotal = computed(() => {
  return invoiceSubtotal.value + invoiceTax.value;
});

function clearInvoice() {
  invoiceObject.status = 'Borrador';
  invoiceObject.clientCompany = '';
  invoiceObject.clientName = null;
  invoiceObject.clientName2 = null;
  invoiceObject.clientEmail = null;
  invoiceObject.clientEmail2 = null;
  invoiceObject.currencyType = 'MX';
  invoiceObject.exchangeCost = 0;
  invoiceObject.eta = 'Inmediata';
  invoiceObject.notes = '';
  invoiceObject.paymentTerms = 0;
  invoiceObject.paymentDueDate = null;
  invoiceObject.condition = '';
  invoiceObject.paymentType = '';
  invoiceObject.featureType = 'texto';
  // invoiceObject.features = { text: '', image: null };
  invoiceObject.invoiceItem = [{ itemName: '', qty: 1, partNo: '', price: 0, total: 0 }];
  isLoading.value = false;
}

const closeInvoice = () => {
  toggleInvoice();
  // if (editInvoice.value) {
  //   editCurrentInvoice();
  // }
};

const deleteInvoiceItem = (id) => {
  if (invoiceObject.invoiceItem.length === 1) {
    return;
  }
  invoiceObject.invoiceItem = invoiceObject.invoiceItem.filter((item) => item.id !== id);
};

const addNewInvoiceItem = () => {
  invoiceObject.invoiceItem.push({
    itemName: '',
    qty: 1,
    partNo: '',
    price: 0,
    total: 0,
  });
};

//// Get image from input
// const onUpload = async (e) => {
//   const files = e.target.files;
//   let filename = files[0].name;
//   if (filename.lastIndexOf('.') <= 0) {
//     return alert('Please add a valid file');
//   }

//   const fileReader = new FileReader();
//   fileReader.addEventListener('load', () => {
//     invoiceObject.features.image = fileReader.result;
//   });
//   fileReader.readAsDataURL(files[0]);

//   await storageRef.child('features').child(filename).put(files[0]);
//   const urlDescarga = await storageRef.child('features').child(filename).getDownloadURL();
//   invoiceObject.features.image = urlDescarga;
// };

const uploadInvoice = async () => {
  const { newInvoice } = await useInvoice();
  isLoading.value = true;
  invoicesLoaded.value = false;

  await newInvoice({
    ...invoiceObject,
    invId: invoiceObject.invId.toString(),
    invoiceDateUnix: invoiceObject.invoiceDateUnix.toString(),
    paymentDueDateUnix: invoiceObject.paymentDueDateUnix.toString(),
    invoiceSubtotal: invoiceSubtotal.value,
    invoiceTax: invoiceTax.value,
    invoiceTotal: invoiceTotal.value,
  });

  // filteredInvoices.value.push({
  //   invId: invoiceObject.invId.toString(),
  //   invoiceDate: invoiceObject.invoiceDate,
  //   clientCompany: invoiceObject.clientCompany,
  //   invoiceTotal: invoiceTotal.value,
  //   status: invoiceObject.status,
  // });

  setTimeout(() => {
    filterResults.value = true;
    modal.value.scrollTop = 0;
    clearInvoice();

    isLoading.value = false;
    invoicesLoaded.value = true;

    closeBtn.value.click();

    closeInvoice();

    const html = document.querySelector('html');
    html.style.overflowY = 'scroll';
  }, 1000);
};

const updateInvoice = async () => {
  isLoading.value = true;

  await newInvoice({
    ...invoiceObject,
    invId: invoiceObject.invId.toString(),
    invoiceDateUnix: invoiceObject.invoiceDateUnix.toString(),
    paymentDueDateUnix: invoiceObject.paymentDueDateUnix.toString(),
    invoiceSubtotal: invoiceSubtotal.value,
    invoiceTax: invoiceTax.value,
    invoiceTotal: invoiceTotal.value,
  });

  setTimeout(() => {
    modal.value.scrollTop = 0;
    clearInvoice();

    isLoading.value = false;
    invoicesLoaded.value = true;

    closeBtn.value.click();

    closeInvoice();
    const html = document.querySelector('html');
    html.style.overflowY = 'scroll';
  }, 1000);
};

const submitForm = async () => {
  v$.value.$validate();
  if (!v$.value.$error) {
    // if (editInvoice.value) {
    //   updateInvoice();
    //   return;
    // }
    uploadInvoice();
  } else {
    // modal.value.scrollTop = 0;
    // window.scrollY = 0;
    isLoading.value = false;
  }
};

if (!editInvoice.value) {
  invoiceObject.invoiceDateUnix = Date.now();
  invoiceObject.invoiceDate = new Date(invoiceObject.invoiceDateUnix).toLocaleDateString(
    'es-mx',
    dateOptions
  );
}

// watch(editInvoice, async () => {
//   currentInvoice.value = await useInvoice(id);
//   isLoading.value = false;
//   invoiceObject.clientCompany = currentInvoice.value.clientCompany;
//   invoiceObject.clientName = currentInvoice.value.clientName;
//   invoiceObject.clientName2 = currentInvoice.value.clientName2;
//   invoiceObject.clientEmail = currentInvoice.value.clientEmail;
//   invoiceObject.clientEmail2 = currentInvoice.value.clientEmail2;
//   invoiceObject.currencyType = currentInvoice.value.currencyType;
//   invoiceObject.exchangeCost = currentInvoice.value.exchangeCost;
//   invoiceObject.eta = currentInvoice.value.eta;
//   invoiceObject.invoiceDateUnix = currentInvoice.value.invoiceDateUnix;
//   invoiceObject.invoiceDate = currentInvoice.value.invoiceDate;
//   invoiceObject.paymentTerms = currentInvoice.value.paymentTerms;
//   invoiceObject.paymentDueDateUnix = currentInvoice.value.paymentDueDateUnix;
//   invoiceObject.paymentDueDate = currentInvoice.value.paymentDueDate;
//   invoiceObject.condition = currentInvoice.value.condition;
//   invoiceObject.paymentType = currentInvoice.value.paymentType;
//   invoiceObject.notes = currentInvoice.value.notes;
//   invoiceObject.featureType = currentInvoice.value.featureType;
//   invoiceObject.features = currentInvoice.value.features;
//   invoiceObject.invoiceItem = currentInvoice.value.invoiceItem;
//   invoiceObject.status = currentInvoice.value.status;
// });

watch(invoiceDialog, () => {
  clearInvoice();
  v$.value.$reset();
  modal.value.scrollTop = 0;
});

watchEffect(() => {
  const futureDate = new Date();
  invoiceObject.paymentDueDateUnix = futureDate.setDate(
    futureDate.getDate() + parseInt(invoiceObject.paymentTerms)
  );
  invoiceObject.paymentDueDate = new Date(invoiceObject.paymentDueDateUnix).toLocaleDateString(
    'es-MX',
    dateOptions
  );
});

definePageMeta({
  middleware: ['auth'],
  pageTransition: {
    name: 'slide',
    mode: 'out-in',
  },
});
</script>

<template>
  <main ref="modal">
    <!-- <input type="checkbox" id="my-modal-3" class="modal-toggle" /> -->
    <section mo class="container mt-4 flex flex-col items-center gap-8 lg:min-w-min lg:max-w-3xl">
      <!-- <label ref="closeBtn" for="my-modal-3" class="hidden">✕</label> -->
      <button
        type="button"
        @click="toggleModal"
        class="z-50 flex items-center gap-2 self-start text-light-medium"
      >
        <Icon class="text-2xl text-primary" name="heroicons-solid:arrow-left" />
        <span class="text-xs text-dark-medium dark:text-light-strong">Regresar</span>
      </button>

      <div>
        <div
          class="card relative h-full bg-white p-4 shadow-sm dark:border dark:border-dark-medium dark:bg-dark-strong lg:min-w-min lg:max-w-3xl"
        >
          <form @submit.prevent="submitForm" class="scrollbar-form relative w-full">
            <h1
              class="w-fit border-b-2 border-primary text-2xl text-dark-medium dark:border-primary/50 dark:text-light-medium"
            >
              Nueva Cotización
            </h1>

            <div class="mt-8 flex flex-col">
              <h4 class="mb-2 text-primary dark:text-primary/50">Datos generales</h4>

              <div class="flex w-full gap-8">
                <!-- Empresa -->
                <div class="dropdown-bottom dropdown-end dropdown form-control relative mb-4 w-1/2">
                  <label class="label">
                    <span class="label-text text-dark-strong dark:text-light-medium"
                      >Empresa<span class="text-red-500">*</span></span
                    >
                  </label>
                  <div class="form-control relative w-full">
                    <input
                      v-model="invoiceObject.clientCompany"
                      @focus="contactsModal = true"
                      @input="filterContacts"
                      @keydown.esc="clearSearch"
                      autocomplete="off"
                      type="text"
                      placeholder="Escribe aqui..."
                      class="input-primary input w-full bg-light-medium"
                    />
                    <Icon
                      v-if="invoiceObject.clientCompany"
                      @click="clearSearch"
                      name="heroicons-solid:x-mark"
                      class="absolute right-2 top-4 cursor-pointer text-primary"
                    />
                    <label class="label">
                      <span v-if="v$.clientCompany.$error" class="label-text-alt text-red-500">{{
                        v$.clientCompany.$errors[0].$message
                      }}</span>
                    </label>
                  </div>

                  <div v-if="filteredContacts.length > 0 && contactsModal" class="w-1/2">
                    <ul
                      class="dropdown-content menu min-h-12 flex max-h-[250px] w-full rounded-[10px] bg-white p-2 shadow-lg dark:border dark:border-dark-medium dark:bg-dark-strong dark:text-light-strong"
                    >
                      <span class="py-2 pl-2 italic text-primary">Contactos disponibles</span>
                      <li
                        class="cursor-pointer text-dark-medium hover:text-primary dark:text-light-medium dark:hover:text-primary"
                        v-for="filteredContact in filteredContacts"
                        :key="filteredContact.id"
                      >
                        <button @click="setContact(filteredContact)">
                          {{ filteredContact.clientCompany }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  class="dropdown-bottom dropdown form-control relative mb-4 h-full w-1/2 items-end"
                >
                  <label class="label w-full text-left">
                    <span class="label-text text-dark-strong dark:text-light-medium">Etapa</span>
                  </label>
                  <StatusButton :status="invoiceObject.status" @@modal="changeStatusModal" />

                  <div class="w-full">
                    <ul
                      v-if="statusModal"
                      class="dropdown-content menu min-h-12 mt-2 flex max-h-[250px] w-fit rounded-[10px] bg-white p-2 shadow-lg transition-all dark:border dark:border-dark-medium dark:bg-dark-strong dark:text-light-strong"
                    >
                      <!-- <span class="py-2 pl-2 italic text-primary">Contactos disponibles</span> -->
                      <li
                        class="cursor-pointer text-dark-medium dark:text-light-medium dark:hover:text-primary"
                      >
                        <button type="button" @click="changeStatus('Borrador')">
                          <Icon name="ri:draft-line" class="text-base" />
                          Borrador
                        </button>
                      </li>
                      <li
                        class="cursor-pointer text-dark-medium dark:text-light-medium dark:hover:text-primary"
                      >
                        <button type="button" @click="changeStatus('Pendiente')">
                          <Icon name="icon-park-outline:caution" class="text-base text-secondary" />
                          Pendiente
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="divider"></div>

              <!-- Contactos -->
              <div class="mb-4 flex w-full gap-8">
                <div class="mb-2 w-1/2">
                  <h4
                    class="mb-2 w-fit border-b border-black text-primary dark:border-[#f2f2f2] dark:text-primary/50"
                  >
                    Contacto 1
                  </h4>
                  <div class="form-control relative mb-2 flex flex-col">
                    <label for="clientName" class=""
                      >Nombre<span class="text-red-500">*</span></label
                    >
                    <input
                      class="input-primary input w-full bg-light-medium"
                      type="text"
                      id="clientName"
                      v-model="invoiceObject.clientName"
                    />
                    <label class="label">
                      <span v-if="v$.clientName.$error" class="label-text-alt text-red-500">{{
                        v$.clientName.$errors[0].$message
                      }}</span>
                    </label>
                  </div>
                  <div class="form-control flex flex-col">
                    <label for="clientEmail" class="dark:text-light-strong"
                      >Correo electrónico<span class="text-red-500">*</span></label
                    >
                    <input
                      class="input-primary input w-full bg-light-medium"
                      type="text"
                      id="clientEmail"
                      v-model="invoiceObject.clientEmail"
                      @change="v$.clientEmail.$touch"
                    />
                    <label class="label">
                      <span v-if="v$.clientEmail.$error" class="label-text-alt text-red-500">{{
                        v$.clientEmail.$errors[0].$message
                      }}</span>
                    </label>
                  </div>
                </div>
                <div class="mb-2 w-1/2">
                  <h4
                    class="mb-2 w-fit border-b border-black text-primary dark:border-[#f2f2f2] dark:text-primary/50"
                  >
                    Contacto 2
                  </h4>
                  <div class="form-control mb-2 flex flex-col">
                    <label for="clientName" class="dark:text-light-strong">Nombre</label>
                    <input
                      class="input-primary input w-full bg-light-medium"
                      type="text"
                      id="clientName"
                      v-model="invoiceObject.clientName2"
                    />
                    <label class="label">
                      <span v-if="v$.clientName.$error" class="label-text-alt text-transparent"
                        >.</span
                      >
                    </label>
                  </div>
                  <div class="form-control flex flex-col">
                    <label for="clientEmail" class="dark:text-light-strong"
                      >Correo electrónico</label
                    >
                    <input
                      class="input-primary input w-full bg-light-medium"
                      type="text"
                      id="clientEmail"
                      v-model="invoiceObject.clientEmail2"
                      @change="v$.clientEmail2.$touch"
                    />
                    <label class="label">
                      <span v-if="v$.clientEmail2.$error" class="label-text-alt text-red-500">{{
                        v$.clientEmail2.$errors[0].$message
                      }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="divider"></div>

              <div class="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
                <!-- <div class="payment flex"> -->
                <div class="flex flex-col">
                  <label for="invoiceDate" class="dark:text-light-strong">Fecha</label>
                  <input
                    class="input-primary input w-full rounded-xl border-none py-1 px-3 text-[12px] leading-8 text-dark-medium outline-none placeholder:italic disabled:bg-light-medium dark:bg-dark-medium dark:text-light-strong"
                    disabled
                    type="text"
                    id="invoiceDate"
                    v-model="invoiceObject.invoiceDate"
                  />
                </div>
                <div class="form-control flex flex-col">
                  <label for="paymentDueDate" class="dark:text-light-strong"
                    >Días de vigencia<span class="text-red-500">*</span></label
                  >
                  <input
                    type="number"
                    id="paymentDueDate"
                    class="input-primary input w-full bg-light-medium"
                    v-model="invoiceObject.paymentTerms"
                  />
                  <label class="label">
                    <span class="label-text-alt text-red-500" v-if="v$.paymentTerms.$error">{{
                      v$.paymentTerms.$errors[0].$message
                    }}</span>
                  </label>
                </div>
                <div class="flex flex-col">
                  <label
                    for="paymentDueDate"
                    class="mb-[6px] text-[10px] dark:text-light-strong lg:text-[12px]"
                    data-label="entrega"
                    >Tiempo de entrega</label
                  >
                  <input
                    class="input-primary input w-full bg-light-medium"
                    type="text"
                    id="paymentDueDate"
                    v-model="invoiceObject.eta"
                  />
                </div>
              </div>

              <!-- Currency -->
              <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <div class="flex flex-col">
                  <label for="currencyType" class="dark:text-light-strong">Moneda</label>
                  <select
                    class="input-primary input w-full bg-light-medium"
                    name="currencyType"
                    v-model="invoiceObject.currencyType"
                    id="currencyType"
                  >
                    <option value="MX">MX</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div class="flex flex-col">
                  <label for="exchangeCost" class="dark:text-light-strong">Tipo de cambio</label>
                  <input
                    class="input-primary input w-full bg-light-medium disabled:bg-light-strong dark:disabled:bg-dark-medium"
                    type="number"
                    id="exchangeCost"
                    v-model="invoiceObject.exchangeCost"
                    :disabled="invoiceObject.currencyType === 'MX'"
                    :title="
                      invoiceObject.currencyType === 'MX'
                        ? 'Este campo se habilita cuando el tipo de moneda es USD'
                        : null
                    "
                  />
                </div>
                <div class="flex flex-col">
                  <label for="paymentType" class="dark:text-light-strong"
                    >Forma de pago<span class="text-red-500">*</span></label
                  >
                  <select
                    v-model="invoiceObject.paymentType"
                    class="input-primary input w-full bg-light-medium"
                    name="paymentType"
                    id="paymentType"
                  >
                    <option value="Contado" class="dark:text-light-strong">Contado</option>
                    <option value="Crédito" class="dark:text-light-strong">Crédito</option>
                  </select>
                  <label class="label">
                    <span v-if="v$.paymentType.$error" class="label-text-alt text-red-500">{{
                      v$.paymentType.$errors[0].$message
                    }}</span>
                  </label>
                </div>
              </div>

              <div class="flex flex-col">
                <label for="condition" class="">Condición<span class="text-red-500">*</span></label>
                <select
                  class="input-primary input w-full bg-light-medium"
                  v-model="invoiceObject.condition"
                  name="condition"
                  id="condition"
                >
                  <option value="nuevo" class="dark:text-light-strong">Nuevo</option>
                  <option value="usado" class="dark:text-light-strong">Usado</option>
                  <option value="refurbished" class="dark:text-light-strong">Refurbished</option>
                </select>
                <label class="label">
                  <span v-if="v$.condition.$error" class="label-text-alt text-red-500">{{
                    v$.condition.$errors[0].$message
                  }}</span>
                </label>
              </div>

              <div class="divider"></div>

              <div class="flex flex-col">
                <div class="mt-8">
                  <h3 class="mb-4 text-primary dark:text-primary/50">Artículos</h3>
                  <table class="w-full">
                    <thead>
                      <tr class="mb-4 flex w-full gap-4 text-dark-medium dark:text-light-medium">
                        <th class="w-2/12"># Parte</th>
                        <th class="item-name w-4/12">Descripción</th>
                        <th class="qty w-2/12">Ctd</th>
                        <th class="price w-2/12">Precio</th>
                        <th class="total w-2/12">Total</th>
                      </tr>
                    </thead>
                    <TransitionGroup
                      name="list"
                      tag="tbody"
                      class="mb-4 flex w-full flex-col gap-4"
                      appear
                    >
                      <tr
                        class="table-items relative flex items-start gap-2 lg:gap-4"
                        v-for="(item, index) in invoiceObject.invoiceItem"
                        :key="index"
                      >
                        <td class="w-2/12">
                          <input
                            class="input w-full bg-light-medium focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                            type="text"
                            v-model="item.partNo"
                          />
                        </td>
                        <td class="w-4/12">
                          <div class="form-control">
                            <input
                              class="input w-full rounded-[10px] border-none bg-light-medium focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                              type="text"
                              v-model="item.itemName"
                            />
                          </div>
                        </td>
                        <td class="w-2/12">
                          <input
                            class="input w-full bg-light-medium text-center focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                            type="number"
                            v-model="item.qty"
                          />
                        </td>
                        <td class="relative w-2/12">
                          <input
                            class="input w-full bg-light-medium text-right focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                            type="number"
                            v-model="item.price"
                          />
                          <span
                            class="absolute left-2 top-3 text-dark-medium dark:text-light-medium"
                            >$</span
                          >
                        </td>
                        <td
                          class="flex h-10 w-2/12 items-center justify-end pr-4 text-dark-medium dark:text-light-medium"
                        >
                          {{
                            new Intl.NumberFormat('es-MX', {
                              style: 'currency',
                              currency: 'MXN',
                            }).format((item.total = item.qty * item.price))
                          }}
                        </td>
                        <td
                          class="absolute -top-5 right-0"
                          v-if="invoiceObject.invoiceItem.length > 1"
                        >
                          <Icon
                            @click="deleteInvoiceItem(item.id)"
                            class="m-auto cursor-pointer text-base text-primary"
                            title="Borrar artículo"
                            name="icon-park-outline:delete"
                          />
                        </td>
                      </tr>
                    </TransitionGroup>
                  </table>

                  <div class="divider"></div>

                  <section
                    @click="addNewInvoiceItem"
                    class="btn mx-auto flex w-fit gap-2 border-none bg-primary text-white hover:bg-primary/50 dark:bg-primary/50 dark:hover:bg-primary"
                  >
                    <i class="fa-solid fa-plus"></i>
                    Agregar artículo
                  </section>

                  <section class="form-control mt-8 mb-4 flex flex-col">
                    <label for="notes" class="">Notas</label>
                    <textarea
                      id="notes"
                      class="input-primary input h-60 rounded-[16px] border-none bg-light-medium focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                      v-model="invoiceObject.notes"
                      @input="v$.notes.$touch"
                      maxlength="100"
                    ></textarea>
                    <label class="label">
                      <span v-if="v$.notes.$error" class="label-text-alt text-red-500">{{
                        v$.notes.$errors[0].$message
                      }}</span>
                    </label>
                  </section>

                  <section class="mb-4 flex flex-col gap-2">
                    <div class="flex w-full justify-end gap-4 pr-4 font-bold">
                      <p class="text-primary">Subtotal:</p>
                      <p class="text-dark-medium dark:text-light-medium">
                        {{
                          new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                          }).format(invoiceSubtotal)
                        }}
                      </p>
                    </div>
                    <div class="flex w-full justify-end gap-4 pr-4 font-bold">
                      <p class="text-primary">Impuestos:</p>
                      <p class="text-dark-medium dark:text-light-medium">
                        {{
                          new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                          }).format(invoiceTax)
                        }}
                      </p>
                    </div>
                    <div class="flex w-full justify-end gap-4 pr-4 font-bold">
                      <p class="text-primary">Total:</p>
                      <p class="text-dark-medium dark:text-light-medium">
                        {{
                          new Intl.NumberFormat('es-MX', {
                            style: 'currency',
                            currency: 'MXN',
                          }).format(invoiceTotal)
                        }}
                      </p>
                    </div>
                  </section>

                  <div class="flex flex-col gap-2 lg:flex-row lg:justify-end">
                    <button
                      type="button"
                      @click="toggleModal"
                      class="btn border-none bg-light-strong text-dark-medium hover:bg-light-strong hover:text-primary focus:outline-primary dark:bg-light-medium dark:hover:bg-primary lg:w-56"
                    >
                      <span>Cancelar</span>
                    </button>
                    <button
                      class="btn border-none bg-primary text-light-medium hover:bg-primary/50 focus:outline-primary dark:bg-primary/50 dark:hover:bg-primary lg:w-56"
                    >
                      <LoadingSpinner v-if="isLoading" />
                      <span v-else>{{
                        editInvoice ? 'Actualizar Cotización' : 'Crear Cotización'
                      }}</span>
                    </button>
                  </div>
                  <!-- </div> -->
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
::-webkit-scrollbar-track {
  @apply my-2 rounded-xl;
}

label {
  @apply mb-1 text-xs text-dark-medium dark:text-light-medium;
}
</style>
