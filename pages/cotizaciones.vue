<script setup>
// Imports
import noResults from '@/assets/images/no-results.svg';
import gsap from 'gsap';

const store = useStore();
const { isLoading, isLoadingFull, invoicesLoaded, searchQuery, filterQuery, filterResults } =
  storeToRefs(store);

// const { invoices } = await useInvoices();
const invoices = ref([]);
const filterMenu = ref(true);
const filteredInvoices = ref([]);

filteredInvoices.value = invoices.value;

onMounted(async () => {
  const { invoices: invoiceData } = await useInvoices();
  invoices.value = invoiceData.value;

  setTimeout(() => {
    isLoading.value = false;
    invoicesLoaded.value = true;
  }, 1000);
  if (filterQuery.value) {
    searchInvoices();
  }
});

const searchSubmit = ref(false);
const filterStatus = ref('Todas');
function searchInvoices() {
  searchSubmit.value = true;
  filterMenu.value = false;
  invoicesLoaded.value = false;
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    invoicesLoaded.value = true;
  }, 1000);

  if (filterQuery.value === 'Todas') {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return invoice.clientCompany.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  } else {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return (
        invoice.clientCompany.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        invoice.status === filterQuery.value
      );
    });
  }

  if (filteredInvoices.value.length === 0) {
    filterResults.value = false;
  } else {
    filterResults.value = true;
  }
}

function searchCleared() {
  filterMenu.value = true;
  filterStatus.value = 'Todas';
}

const invoiceBtn = ref(null);

const newInvoice = () => {
  return navigateTo('nueva-cotizacion');
};

const beforeEnter = (el) => {
  console.log('beforeEnter');
  el.style.transform = 'translateY(100px)';
  el.style.opacity = 0;
};

const enter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    onComplete: done,
    delay: el.dataset.index * 0.2,
  });
};

definePageMeta({
  middleware: ['auth'],
  // pageTransition: {
  // name: 'slide',
  // mode: 'out-in',
  // },
});
</script>

<template>
  <Transition name="slide" appear>
    <div class="custom-container">
      <div>
        <transition appear @before-enter="beforeEnter" @enter="enter">
          <div class="mb-8 flex justify-between">
            <div class="left flex flex-col">
              <h1 class="text-2xl text-primary dark:text-primary/50 lg:text-3xl">Cotizaciones</h1>
              <span class="text-sm text-dark-strong dark:text-light-strong"
                >Tienes (<span class="text-primary dark:text-primary/50">{{ invoices.length }}</span
                >) en total</span
              >
            </div>
            <div class="right flex flex-col-reverse items-end gap-4 lg:flex-row lg:items-center">
              <label ref="invoiceBtn" for="my-modal-3" class="hidden"> </label>
              <button
                class="btn-primary btn-square btn w-fit px-2 text-light-medium hover:border-primary/50 hover:bg-primary/50 dark:border-primary/50 dark:bg-primary/50 dark:hover:bg-primary"
                @click="newInvoice"
              >
                <Icon name="icon-park-outline:plus" class="text-2xl" />

                <span>Cotización</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- Invoices -->

        <div class="w-full">
          <!-- Search box -->
          <section class="flex w-full items-center justify-between">
            <SearchBar @@search="searchInvoices($event)" @@clear="searchCleared" />
          </section>

          <section
            class="relative mt-8 hidden w-full items-center justify-between rounded-2xl py-7 px-4 text-primary transition-all duration-300 focus:outline-primary lg:flex lg:px-8"
          >
            <p class="w-[5%] lg:w-[10%]">ID</p>
            <p class="w-[20%]">Fecha</p>
            <p class="w-[30%] lg:w-[25%]">Empresa</p>
            <p class="hidden w-[25%] lg:block">Total</p>
            <p class="w-[20%]">Status</p>
          </section>

          <TransitionGroup
            v-if="invoicesLoaded && filterResults && invoices"
            tag="section"
            class="mt-8 flex flex-col items-center gap-10 lg:mt-0 lg:gap-4"
            appear
            name="slide-up"
          >
            <MyInvoiceMobile
              v-for="(invoice, index) in filteredInvoices"
              :style="{ transitionDelay: `${index * 200}ms` }"
              :data-index="index"
              :invoice="invoice"
              :key="invoice.invId"
            />
          </TransitionGroup>

          <!-- No filter results -->
          <div
            v-if="
              filteredInvoices.length === 0 && invoices.length > 0 && !isLoading && !filterResults
            "
            class="mt-16 w-full text-center"
          >
            <img :src="noResults" class="mx-auto mb-8 w-32" alt="" />
            <span class="text-dark-medium dark:text-light-medium"
              >No se encontraron resultados</span
            >
          </div>

          <LoadingSpinner class="pt-16" v-if="isLoading" />
        </div>

        <!-- If no invoices -->
        <NoInvoices v-if="invoices.length === 0 && invoicesLoaded && !isLoading" />
      </div>
    </div>
  </Transition>
</template>
