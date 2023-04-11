<script setup>
// Dependencies imports
import { useStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import { uid } from 'uid';

const supabase = useSupabaseClient();

// Definitions
const state = reactive({
  dateOptions: { year: 'numeric', month: 'short', day: 'numeric' },
  loadingDraft: null,
  loadingSubmit: null,
  clientCompany: '',
  clientName: null,
  clientName2: null,
  clientEmail: null,
  clientEmail2: null,
  invoiceDateUnix: null,
  invoiceDate: null,
  paymentTerms: 1,
  paymentDueDateUnix: null,
  paymentDueDate: null,
  currencyType: 'MX',
  exchangeCost: 0,
  eta: 'Inmediata',
  condition: '',
  paymentType: '',
  notes: '',
  featureType: 'texto',
  features: { text: '', image: null },
  invoicePending: false,
  invoiceDraft: false,
  invoiceItemList: [{ id: uid(2), itemName: '', qty: '1', partNo: '', price: '0' }],
  invoiceSubtotal: 0,
});

const { editInvoice, currentInvoice, contactData } = storeToRefs(useStore());
const { editCurrentInvoice, updateCurrentInvoice, getInvoices, toggleModal } = useStore();

// Contacts autocomplete

const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map((clientCompany) => {
    return contactData.value.find((a) => a.clientCompany === clientCompany);
  })
);

const filteredContacts = ref([]);
const contactsModal = ref(false);

const filterContacts = () => {
  if (state.clientCompany.length === 0) {
    filteredContacts.value = uniqueContacts.value;
  }

  filteredContacts.value = uniqueContacts.value.filter((contact) => {
    return contact.clientCompany.toLowerCase().startsWith(state.clientCompany.toLowerCase());
  });
};

console.log(currentInvoice);

onMounted(() => {
  filterContacts();
});

watch(
  () => state.clientCompany,
  () => {
    filterContacts();
  }
);

const setContact = (contact) => {
  state.clientCompany = contact.clientCompany;
  state.clientName = contact.clientName;
  state.clientEmail = contact.clientEmail;
  contactsModal.value = false;
};

// Invoice processing

const invoiceTax = computed(() => {
  return state.invoiceSubtotal * 0.16;
});

const invoiceTotal = computed(() => {
  return state.invoiceSubtotal + invoiceTax.value;
});

const closeInvoice = () => {
  useStore().toggleInvoice();
  if (editInvoice.value) {
    editCurrentInvoice();
  }
};

const addNewInvoiceItem = () => {
  state.invoiceItemList.push({
    id: uid(2),
    itemName: '',
    qty: '1',
    partNo: '',
    price: 0,
    total: 0,
  });
};

//// Get image from input
const onUpload = async (e) => {
  const files = e.target.files;
  let filename = files[0].name;
  if (filename.lastIndexOf('.') <= 0) {
    return alert('Please add a valid file');
  }

  const fileReader = new FileReader();
  fileReader.addEventListener('load', () => {
    state.features.image = fileReader.result;
  });
  fileReader.readAsDataURL(files[0]);

  await storageRef.child('features').child(filename).put(files[0]);
  const urlDescarga = await storageRef.child('features').child(filename).getDownloadURL();
  state.features.image = urlDescarga;
};

//// Close modal when click outside
// const invoiceWrap = ref(null);
// const checkClick = (e) => {
//   if (e.target === invoiceWrap.value) {
//     toggleModal();
//   }
// };

const deleteInvoiceItem = (id) => {
  state.invoiceItemList = state.invoiceItemList.filter((item) => item.id !== id);
};

const calInvoiceTotal = () => {
  state.invoiceSubtotal = 0;
  state.invoiceItemList.forEach((item) => {
    state.invoiceSubtotal += item.total;
  });
};

const publishInvoice = () => {
  state.invoicePending = true;
};

const saveDraft = () => {
  state.invoiceDraft = true;
};

// Send invoice to Supabase
const uploadInvoice = async () => {
  if (state.invoiceItemList.length <= 0) {
    alert('Favor de agregar articulos a la cotizacion!');
    return;
  }

  if (state.invoicePending || state.invoicePaid) {
    state.loadingSubmit = true;
  }

  if (state.invoiceDraft) {
    state.loadingDraft = true;
  }

  calInvoiceTotal();

  try {
    const { error } = await supabase.from('invoices').insert([
      {
        clientCompany: state.clientCompany,
        clientName: state.clientName,
        clientName2: state.clientName2,
        clientEmail: state.clientEmail,
        clientEmail2: state.clientEmail2,
        currencyType: state.currencyType,
        exchangeCost: state.exchangeCost,
        eta: state.eta,
        notes: state.notes,
        invoiceDate: state.invoiceDate,
        invoiceDateUnix: state.invoiceDateUnix,
        paymentTerms: state.paymentTerms,
        paymentDueDate: state.paymentDueDate,
        paymentDueDateUnix: state.paymentDueDateUnix,
        condition: state.condition,
        paymentType: state.paymentType,
        featureType: state.featureType,
        features: state.features,
        invoiceItemList: state.invoiceItemList,
        invoiceSubtotal: state.invoiceSubtotal,
        invoiceTax: invoiceTax.value,
        invoiceTotal: invoiceTotal.value,
        invoicePending: state.invoicePending,
        invoiceDraft: state.invoiceDraft,
        invoicePaid: false,
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }

  getInvoices();

  state.loading = false;

  closeInvoice();
};

// Update current invoice in Supabase
const updateInvoice = async () => {
  if (state.invoiceItemList.length <= 0) {
    alert('Please ensure you filled out work items!');
    return;
  }

  state.loadingSubmit = true;

  calInvoiceTotal();

  try {
    const { error } = await supabase
      .from('invoices')
      .update({
        clientCompany: state.clientCompany,
        clientName: state.clientName,
        clientName2: state.clientName2,
        clientEmail: state.clientEmail,
        clientEmail2: state.clientEmail2,
        currencyType: state.currencyType,
        exchangeCost: state.exchangeCost,
        eta: state.eta,
        paymentTerms: state.paymentTerms,
        paymentDueDate: state.paymentDueDate,
        paymentDueDateUnix: state.paymentDueDateUnix,
        condition: state.condition,
        paymentType: state.paymentType,
        notes: state.notes,
        featureType: state.featureType,
        features: state.features,
        invoiceItemList: state.invoiceItemList,
        invoiceSubtotal: state.invoiceSubtotal,
        invoiceTax: invoiceTax.value,
        invoiceTotal: invoiceTotal.value,
      })
      .eq('id', currentInvoice.value.id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }

  setTimeout(() => {
    updateCurrentInvoice(currentInvoice.value.id);
  }, 1000);

  await getInvoices();
};

const submitForm = () => {
  if (editInvoice.value) {
    updateInvoice();
    return;
  }
  uploadInvoice();
};

if (!editInvoice.value) {
  state.invoiceDateUnix = Date.now();
  state.invoiceDate = new Date(state.invoiceDateUnix).toLocaleDateString(
    'es-mx',
    state.dateOptions
  );
}

if (editInvoice.value) {
  state.clientCompany = currentInvoice.value.clientCompany;
  state.clientName = currentInvoice.value.clientName;
  state.clientName2 = currentInvoice.value.clientName2;
  state.clientEmail = currentInvoice.value.clientEmail;
  state.clientEmail2 = currentInvoice.value.clientEmail2;
  state.currencyType = currentInvoice.value.currencyType;
  state.exchangeCost = currentInvoice.value.exchangeCost;
  state.eta = currentInvoice.value.eta;
  state.invoiceDateUnix = currentInvoice.value.invoiceDateUnix;
  state.invoiceDate = currentInvoice.value.invoiceDate;
  state.paymentTerms = currentInvoice.value.paymentTerms;
  state.paymentDueDateUnix = currentInvoice.value.paymentDueDateUnix;
  state.paymentDueDate = currentInvoice.value.paymentDueDate;
  state.condition = currentInvoice.value.condition;
  state.paymentType = currentInvoice.value.paymentType;
  state.notes = currentInvoice.value.notes;
  state.featureType = currentInvoice.value.featureType;
  state.features = currentInvoice.value.features;
  state.invoicePending = currentInvoice.value.invoicePending;
  state.invoiceDraft = currentInvoice.value.invoiceDraft;
  state.invoiceItemList = currentInvoice.value.invoiceItemList;
  state.invoiceSubtotal = currentInvoice.value.invoiceSubtotal;
}

watchEffect(() => {
  const futureDate = new Date();
  state.paymentDueDateUnix = futureDate.setDate(
    futureDate.getDate() + parseInt(state.paymentTerms)
  );
  state.paymentDueDate = new Date(state.paymentDueDateUnix).toLocaleDateString(
    'es-MX',
    state.dateOptions
  );
});
</script>

<template>
  <div ref="invoiceWrap" class="modal z-50 flex w-[300vw] flex-col bg-[#1a1a1a]/50 lg:w-[200vw]">
    <!-- < class="modal"> -->
    <!-- @click="checkClick" -->

    <Transition name="invoice">
      <!-- <div class="modal-box relative"> -->
      <form
        @submit.prevent="submitForm"
        class="bg-light relative w-screen bg-light-medium px-4 pt-40 pb-14 dark:bg-dark-strong lg:max-w-3xl lg:p-14"
      >
        <!-- <LoadingSpinner v-show="state.loading" /> -->
        <h1
          class="w-fit border-b-2 border-primary text-2xl text-[#1a1a1a] dark:border-primary/50 dark:text-[#f2f2f2]"
          v-if="!editInvoice"
        >
          Nueva Cotización
        </h1>
        <h1
          class="w-fit border-b-2 border-primary text-2xl text-[#1a1a1a] dark:text-light-strong"
          v-else
        >
          Editar Cotización
        </h1>

        <!-- Bill To -->
        <div class="bill-to flex flex-col gap-4">
          <h4 class="text-primary dark:text-primary/50">Datos generales</h4>

          <div class="flex w-full flex-col">
            <label for="clientCompany" class="dark:text-light-strong">Empresa</label>
            <input
              class="input z-10 focus:ring-primary dark:bg-dark-medium dark:text-light-strong dark:focus:ring-primary/50"
              required
              type="text"
              id="clientCompany"
              v-model="state.clientCompany"
              @input="filterContacts"
              @focus="contactsModal = true"
              autocomplete="off"
            />
            <div
              v-if="filteredContacts && contactsModal"
              class="absolute inset-0 z-0"
              @click="contactsModal = false"
            ></div>
            <div v-if="filteredContacts.length > 0 && contactsModal" class="z-10">
              <ul
                class="bg-light min-h-12 absolute mt-2 flex max-h-[250px] w-4/5 flex-col gap-2 overflow-y-scroll rounded-[10px] bg-light-medium p-4 shadow-lg dark:bg-dark-medium dark:text-light-strong"
              >
                <li
                  class="cursor-pointer transition-all hover:font-bold hover:text-secondary"
                  v-for="filteredContact in filteredContacts"
                  :key="filteredContact.id"
                  @click="setContact(filteredContact)"
                >
                  {{ filteredContact.clientCompany }}
                </li>
              </ul>
            </div>
          </div>
          <div class="flex w-full gap-8">
            <div class="mb-2 w-1/2">
              <h4
                class="mb-2 w-fit border-b border-black text-primary dark:border-[#f2f2f2] dark:text-primary/50"
              >
                Contacto 1
              </h4>
              <div class="mb-2 flex flex-col">
                <label for="clientName" class="dark:text-[#f2f2f2]">Nombre</label>
                <input
                  class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                  required
                  type="text"
                  id="clientName"
                  v-model="state.clientName"
                />
              </div>
              <div class="flex flex-col">
                <label for="clientEmail" class="dark:text-light-strong">Correo electrónico</label>
                <input
                  class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                  required
                  type="email"
                  id="clientEmail"
                  v-model="state.clientEmail"
                />
              </div>
            </div>
            <div class="mb-2 w-1/2">
              <h4
                class="dark:border-light mb-2 w-fit border-b border-black text-primary dark:text-primary/50"
              >
                Contacto 2
              </h4>
              <div class="mb-2 flex flex-col">
                <label for="clientName" class="dark:text-light-strong">Nombre</label>
                <input
                  class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                  type="text"
                  id="clientName"
                  v-model="state.clientName2"
                />
              </div>
              <div class="flex flex-col">
                <label for="clientEmail" class="dark:text-light-strong">Correo electrónico</label>
                <input
                  class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                  type="email"
                  id="clientEmail"
                  v-model="state.clientEmail2"
                />
              </div>
            </div>
          </div>

          <div class="location-details flex">
            <div class="flex flex-col">
              <label for="currencyType" class="dark:text-light-strong">Moneda</label>
              <!-- <input
                class="focus:ring-primary"
                required
                type="text"
                id="currencyType"
                v-model="state.currencyType"
              /> -->
              <select
                class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                name="currencyType"
                v-model="state.currencyType"
                id="currencyType"
              >
                <option value="MX">MX</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label for="exchangeCost" class="dark:text-light-strong">Tipo de cambio</label>
              <input
                class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                type="text"
                id="exchangeCost"
                v-model="state.exchangeCost"
              />
            </div>
          </div>
        </div>

        <!-- Invoice Work Details -->
        <!-- <div class="invoice-work grid grid-cols-2 lg:grid-cols-4"> -->
        <div class="invoice-work flex flex-col">
          <div class="payment grid grid-cols-2 lg:grid-cols-3">
            <!-- <div class="payment flex"> -->
            <div class="flex flex-col">
              <label for="invoiceDate" class="dark:text-light-strong">Fecha</label>
              <input
                class="input text-[12px] disabled:bg-white dark:bg-dark-medium dark:text-light-strong"
                disabled
                type="text"
                id="invoiceDate"
                v-model="state.invoiceDate"
              />
            </div>
            <div class="flex flex-col">
              <label for="paymentDueDate" class="dark:text-light-strong">Días de vigencia</label>
              <input
                class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                type="number"
                id="paymentDueDate"
                v-model="state.paymentTerms"
              />
              <!-- v-model="state.paymentDueDate" -->
            </div>
            <div class="flex flex-col">
              <label
                for="paymentDueDate"
                class="mb-[6px] text-[10px] dark:text-light-strong lg:text-[12px]"
                data-label="entrega"
                >Tiempo de entrega</label
              >
              <input
                class="input text-[12px] focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                type="text"
                id="paymentDueDate"
                v-model="state.eta"
              />
              <!-- v-model="state.paymentDueDate" -->
            </div>
            <div class="flex flex-col">
              <label for="condition" class="dark:text-[#f2f2f2]">Condición</label>
              <select
                class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                v-model="state.condition"
                required
                name="condition"
                id="condition"
              >
                <option value="nuevo" class="dark:text-light-strong">Nuevo</option>
                <option value="usado" class="dark:text-light-strong">Usado</option>
                <option value="refurbished" class="dark:text-light-strong">Refurbished</option>
              </select>
            </div>
            <div class="flex flex-col">
              <label for="paymentType" class="dark:text-light-strong">Forma de pago</label>
              <select
                v-model="state.paymentType"
                class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                required
                name="paymentType"
                id="paymentType"
              >
                <option value="Contado" class="dark:text-light-strong">Contado</option>
                <option value="Crédito" class="dark:text-light-strong">Crédito</option>
              </select>
            </div>
          </div>

          <div class="work-items mt-8">
            <h3 class="mb-4 text-primary dark:text-primary/50">Artículos</h3>
            <table class="item-list">
              <tr class="table-heading flex">
                <!-- <th class="item-id">ID</th> -->
                <th class="price dark:text-[#f2f2f2]"># Parte</th>
                <th class="item-name dark:text-[#f2f2f2]">Descripción</th>
                <th class="qty dark:text-[#f2f2f2]">Ctd</th>
                <th class="price dark:text-[#f2f2f2]">Precio</th>
                <th class="total dark:text-[#f2f2f2]">Total</th>
              </tr>
              <transition-group name="list" tag="div" class="relative">
                <tr
                  class="table-items flex items-start gap-[10px] lg:gap-4"
                  v-for="(item, index) in state.invoiceItemList"
                  :key="index"
                >
                  <td class="price">
                    <input
                      class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                      type="text"
                      v-model="item.partNo"
                    />
                  </td>
                  <td class="item-name">
                    <textarea
                      class="input w-full rounded-[10px] border-none focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                      type="text"
                      v-model="item.itemName"
                    ></textarea>
                  </td>
                  <td class="qty">
                    <input
                      class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                      type="text"
                      v-model="item.qty"
                    />
                  </td>
                  <td class="price">
                    <input
                      class="input focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                      type="text"
                      v-model="item.price"
                    />
                  </td>
                  <td class="total flex h-10 items-center dark:text-light-strong">
                    {{
                      new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                      }).format((item.total = item.qty * item.price))
                    }}
                  </td>
                  <Icon
                    @click="deleteInvoiceItem(item.id)"
                    class="absolute -top-5 right-0 m-auto cursor-pointer text-base text-primary"
                    title="Borrar artículo"
                    name="icon-park-outline:delete"
                  />
                </tr>
              </transition-group>
            </table>

            <div
              @click="addNewInvoiceItem"
              class="btn mx-auto flex w-fit gap-2 border-none bg-primary text-white hover:bg-primary/50 dark:bg-primary/50 dark:hover:bg-primary"
            >
              <i class="fa-solid fa-plus"></i>
              Agregar artículo
            </div>
          </div>

          <!-- Ficha tecnica -->
          <!-- <div class="mt-8 flex flex-col gap-2">
            <h3 class="text-primary dark:text-primary/50">Ficha técnica</h3>
            <fieldset class="flex w-fit gap-8">
              <div class="flex gap-2">
                <label for="html" class="dark:text-light-strong">Texto</label>
                <input
                  v-model="state.featureType"
                  class="radio-primary w-4 focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                  type="radio"
                  id="texto"
                  name="texto"
                  value="texto"
                />
              </div>

              <div class="flex gap-2">
                <label for="imagen" class="dark:text-light-strong">Imagen</label>
                <input
                  v-model="state.featureType"
                  class="radio-primary w-4 focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                  type="radio"
                  id="imagen"
                  name="imagen"
                  value="imagen"
                />
              </div>
            </fieldset>
            <div class="h-60">
              <Transition name="feature" mode="out-in">
                <textarea
                  v-if="state.featureType === 'texto'"
                  id="notes"
                  class="h-full w-full rounded-[16px] border-none focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
                  v-model="state.features.text"
                ></textarea>

                <div v-else class="flex h-full items-center justify-evenly gap-4">
                  <label class="btn-primary btn text-white" for="upload">Subir imagen</label>
                  <input
                    class="hidden"
                    type="file"
                    name="upload"
                    id="upload"
                    accept="image/*"
                    @change="onUpload"
                  />
                  <figure class="h-full w-48">
                    <Transition name="feature" appear>
                      <img
                        class="h-full"
                        :src="state.features.image"
                        alt=""
                        style="transition-delay: 0.3s"
                      />
                    </Transition>
                  </figure>
                </div>
              </Transition>
            </div>
          </div> -->

          <div class="mt-8 flex flex-col">
            <label for="notes" class="dark:text-[#f2f2f2]">Notas</label>
            <textarea
              id="notes"
              class="h-60 rounded-[16px] border-none focus:ring-primary dark:bg-dark-medium dark:text-light-strong"
              v-model="state.notes"
            ></textarea>
          </div>
        </div>

        <!-- Save/Exit -->
        <div class="save flex flex-col gap-2 lg:flex-row">
          <div class="left">
            <button
              type="button"
              @click="toggleModal"
              class="btn w-full border-none bg-light-strong text-dark-medium hover:bg-light-strong hover:text-primary focus:outline-primary dark:bg-light-medium dark:hover:bg-light-medium lg:w-auto"
            >
              Cancelar
            </button>
          </div>
          <div class="right flex flex-col gap-2 lg:flex-row">
            <button
              v-if="!editInvoice"
              type="submit"
              @click="saveDraft"
              class="btn w-56 border-none text-primary hover:bg-primary/50 hover:text-light-medium focus:outline-primary dark:bg-light-medium dark:hover:bg-primary"
            >
              <Loader v-if="state.loadingDraft" />
              <span v-else>Guardar Borrador</span>
            </button>
            <button
              v-if="!editInvoice"
              type="submit"
              @click="publishInvoice"
              class="btn w-56 border-none bg-primary text-light-medium hover:bg-primary/50 focus:outline-primary dark:bg-primary/50 dark:hover:bg-primary"
            >
              <Loader v-if="state.loadingSubmit" />
              <span v-else>Crear Cotización</span>
            </button>
            <button
              v-if="editInvoice"
              type="sumbit"
              class="btn w-56 border-none bg-primary text-light-medium hover:bg-primary/50 focus:outline-primary dark:bg-primary/50 dark:hover:bg-primary"
            >
              <Loader v-if="state.loadingSubmit" />
              <span v-else>Actualizar Cotización</span>
            </button>
          </div>
        </div>
      </form>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
// animated invoice

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.4s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
  opacity: 0;
}

.feature-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.feature-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.feature-enter-active {
  transition: all 0.3s;
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.list-enter-to {
  opacity: 1;
  transform: scale(1);
}

.list-enter-active {
  transition: all 0.4s ease;
}

.list-leave-from {
  opacity: 1;
  transform: scale(1);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.list-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}

.list-move {
  transition: all 0.3s ease;
}

.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  // width: 300vw;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 128px;
  }

  .invoice-content {
    position: relative;
    // padding: 56px;
    // max-width: 700px;
    // width: 100%;

    color: #1a1a1a;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      // color: #e90f02;
    }

    // h3 {
    //   margin-bottom: 16px;
    //   font-size: 18px;
    //   color: #777f98;
    // }

    // h4 {
    //   color: #e90f02;
    //   font-size: 12px;
    //   margin-bottom: 24px;
    // }

    // Bill To / Bill From
    .bill-to,
    .bill-from {
      margin-bottom: 48px;

      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // Invoice Work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // Item Table Styling
          .table-heading,
          .table-items {
            gap: 16px;
            // font-size: 12px;

            .item-id {
              flex-basis: 10%;
            }

            .item-name {
              flex-basis: 40%;
              // flex-basis: 30%;
              // @media (min-width: 900px) {
              //   flex-basis: 50%;
              // }
            }

            .qty {
              flex-basis: 15%;

              @media (min-width: 768px) {
                flex-basis: 10%;
              }
            }

            .price {
              flex-basis: 12%;
              // flex-basis: 20%;
            }

            .total {
              flex-basis: 15%;

              // align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;

            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        // .button {
        //   color: #fff;
        //   background-color: #252945;
        //   align-items: center;
        //   justify-content: center;
        //   width: 100%;

        //   img {
        //     margin-right: 4px;
        //   }
        // }
      }
    }

    .save {
      margin-top: 60px;

      div {
        flex: 1;
      }

      .right {
        justify-content: flex-end;
      }
    }
  }

  // .input {
  //   margin-bottom: 24px;
  // }

  label:not([data-label='entrega']) {
    font-size: 12px;
    margin-bottom: 6px;
    // background-color: transparent !important;
  }

  input:not([type='radio']):not(#invoiceID),
  select {
    width: 100%;
    // background-color: #fff;
    // background-color: #1e2139;
    // color: #1a1a1a;
    border-radius: 10px;
    // padding: 12px 4px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}
</style>
