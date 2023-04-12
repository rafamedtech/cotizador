<script setup>
const store = useStore();
const { invoiceDialog, searchQuery, filterQuery } = storeToRefs(store);



const emit = defineEmits(['@search', '@clear']);

const searchBarRef = ref(null);
function onSearch() {
  invoiceDialog.value = false;
  emit('@search');
}

// Contacts autocomplete

const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map((clientCompany) => {
    return contactData.value.find((a) => a.clientCompany === clientCompany);
  })
);

const filteredContacts = ref([]);
const contactsModal = ref(false);

const filterContacts = () => {
  if (searchQuery.value.length === 0) {
    filteredContacts.value = uniqueContacts.value;
  }

  filteredContacts.value = uniqueContacts.value.filter((contact) => {
    return contact.clientCompany.toLowerCase().startsWith(searchQuery.value.toLowerCase());
  });
};

function setContact(contact) {
  searchQuery.value = contact;
}

// onMounted(() => {
//   filterContacts();
// });

watch(contactsModal, () => {
  const { contactData } = await useContact();
  filteredContacts.value = contactData.value;
});

watch(searchQuery, () => {
  filterContacts();
});

// Filter contacts end

function clearSearch() {
  if (searchQuery.value === '' && filterQuery.value === 'Todas') {
    return;
  }
  searchQuery.value = '';
  filterQuery.value = 'Todas';
  emit('@search', searchQuery.value);
  emit('@clear');
}
</script>

<template>
  <form
    @submit.prevent="onSearch(filterQuery)"
    ref="searchBarRef"
    class="relative flex w-full flex-col gap-2 lg:flex-row lg:items-center"
  >
    <div class="dropdown-bottom dropdown-end dropdown form-control relative w-full lg:w-1/2">
      <label class="label">
        <span class="label-text text-dark-strong dark:text-light-medium">Buscar por cliente</span>
      </label>
      <div class="relative">
        <input
          v-model="searchQuery"
          @focus="contactsModal = true"
          @input="filterContacts"
          @keydown.esc="clearSearch"
          autocomplete="off"
          type="text"
          placeholder="Escribe aqui..."
          class="input-primary input w-full rounded-tl-2xl bg-white focus:bg-transparent dark:bg-dark-strong"
        />
        <Icon
          v-if="searchQuery"
          name="heroicons-solid:x-mark"
          class="absolute right-2 top-4 cursor-pointer text-primary"
          @click="setContact('')"
        />
      </div>

      <div v-if="filteredContacts.length > 0 && contactsModal" class="w-full">
        <ul
          class="dropdown-content menu min-h-12 mt-2 flex max-h-[250px] w-full rounded-[10px] bg-white p-2 shadow-lg dark:bg-dark-strong dark:text-light-strong"
        >
          <span class="py-2 pl-2 italic text-primary">Clientes disponibles</span>
          <li
            class="cursor-pointer text-dark-medium hover:text-primary dark:text-light-medium"
            v-for="filteredContact in filteredContacts"
            :key="filteredContact.id"
          >
            <button type="button" @click="setContact(filteredContact.clientCompany)">
              {{ filteredContact.clientCompany }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex w-full flex-col lg:w-1/2">
      <label class="label">
        <span class="label-text text-dark-strong dark:text-light-medium">Filtrar etapa</span>
      </label>
      <div class="form-control w-full flex-col gap-2 lg:flex-row lg:items-center">
        <select
          v-model="filterQuery"
          class="input select-bordered select w-full items-center rounded-xl font-normal text-dark-medium dark:bg-dark-strong dark:text-light-medium lg:w-44"
        >
          <!-- <option disabled selected>Filtrar etapa</option> -->
          <option>Todas</option>
          <option>Vendida</option>
          <option>Pendiente</option>
          <option>Cancelada</option>
          <option>Borrador</option>
          {{
            filterQuery
          }}
        </select>
        <section
          class="mt-4 flex w-full flex-row-reverse justify-start gap-2 lg:mt-0 lg:flex-row lg:justify-between"
        >
          <button
            class="btn-primary btn text-light-medium hover:border-primary/50 hover:bg-primary/50 dark:border-primary/50 dark:bg-primary/50 dark:hover:bg-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar
          </button>
          <button
            type="button"
            class="btn border-light-strong bg-light-strong text-dark-medium hover:border-light-strong hover:bg-light-strong hover:text-primary dark:border-primary/50 dark:bg-primary/50 dark:hover:bg-primary dark:hover:text-light-medium lg:w-auto"
            @click="clearSearch"
          >
            <Icon name="heroicons-solid:x-mark" class="text-2xl" />
            Reset
          </button>
        </section>
      </div>
    </div>
  </form>
</template>
