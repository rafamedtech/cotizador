<script setup>
// Imports
import { useStore } from '@/stores/main';
import { storeToRefs } from 'pinia';

const store = useStore();

const { getInvoices, toggleInvoice } = store;
const { invoiceData, invoicesLoaded } = storeToRefs(store);

function searchInvoices(input) {
  invoices.value = invoiceData.value.filter((invoice) => {
    return invoice.clientCompany.toLowerCase().includes(input.toLowerCase());
  });
}

const invoices = ref([]);

onMounted(() => {
  invoices.value = invoiceData.value;
});

const newInvoice = () => {
  toggleInvoice();
};

// const filterMenu = ref(false);
// const toggleFilterMenu = () => {
//   filterMenu.value = !filterMenu.value;
// };

// const filteredInvoice = ref('');

// const filteredInvoices = (e) => {
//   if (e.target.innerText === 'Todas') {
//     filteredInvoice.value = '';
//     return;
//   }

//   filteredInvoice.value = e.target.innerText;
// };

// const filteredData = computed(() => {
//   return invoiceData.value.filter((invoice) => {
//     if (filteredInvoice.value === 'Borrador') {
//       return invoice.invoiceDraft === true;
//     }
//     if (filteredInvoice.value === 'Pendiente') {
//       return invoice.invoicePending === true;
//     }
//     if (filteredInvoice.value === 'Vendido') {
//       return invoice.invoicePaid === true;
//     }

//     return invoice;
//   });
// });

// watch(filteredInvoice, () => {
//   filteredData.value = invoiceData.value.filter((item) =>
//     item.clientCompany.toLowerCase().includes(filteredInvoice.value.toLowerCase())
//   );
// });

await getInvoices();

definePageMeta({
  middleware: ['auth'],
  pageTransition: {
    name: 'slide',
    mode: 'out-in',
  },
});
</script>

<template>
  <div class="home custom-container">
    <!-- Header -->
    <div>
      <div class="header flex">
        <div class="left flex flex-col">
          <h1 class="text-2xl text-primary dark:text-primary/50 lg:text-3xl">Cotizaciones</h1>
          <span class="text-sm text-dark-strong dark:text-light-strong"
            >Tienes (<span class="text-primary dark:text-primary/50">{{ invoiceData.length }}</span
            >) en total</span
          >
          <button @click="cambiarNombre"></button>
        </div>
        <div class="right flex flex-col-reverse items-end gap-4 lg:flex-row lg:items-center">
          <!-- <div
            tabindex="0"
            @click="toggleFilterMenu"
            @keypress.enter="toggleFilterMenu"
            @keypress.space="toggleFilterMenu"
            class="flex gap-2 filter dark:text-light-medium"
          >
            <span
              >Filtrar etapa
              <span class="text-secondary" v-if="filteredInvoice"
                >: {{ filteredInvoice }}</span
              ></span
            >
            <Icon name="icon-park-outline:down" />
            <ul
              v-show="filterMenu"
              class="filter-menu bg-light-medium outline-none dark:bg-dark-strong lg:mr-10"
            >
              <li @click="filteredInvoices">Borrador</li>
              <li @click="filteredInvoices">Pendiente</li>
              <li @click="filteredInvoices">Vendido</li>
              <li @click="filteredInvoices">Todas</li>
            </ul>
          </div> -->
          <div
            @click="newInvoice"
            @keypress.enter="newInvoice"
            @keypress.space="newInvoice"
            class="btn flex gap-2 border-none bg-primary text-light-medium hover:bg-primary/50 dark:bg-primary/50 dark:text-light-strong dark:hover:bg-primary dark:hover:text-light-medium"
            tabindex="0"
          >
            <div class="inner-button flex">
              <Icon name="icon-park-outline:plus" class="text-2xl" />
            </div>
            <span>Cotización</span>
          </div>
        </div>
      </div>
      <!-- Invoices -->

      <div>
        <!-- Search box -->
        <section class="flex items-center justify-between">
          <SearchBar @@search="searchInvoices($event)" />
          <div class="dropdown-bottom dropdown-end dropdown">
            <Icon
              size="32"
              tabindex="0"
              name="mdi:dots-vertical"
              class="cursor-pointer text-dark-medium dark:text-light-medium"
            />
            <!-- <Icon
              :size="32"
              tabindex="0"
              name="icon-park-outline:down"
              class="cursor-pointer text-dark-medium dark:text-light-medium"
            /> -->

            <ul
              tabindex="0"
              class="dark dropdown-content menu rounded-box w-52 bg-white p-2 text-dark-strong shadow dark:bg-dark-strong dark:text-light-medium"
            >
              <li class="hover:text-primary"><button>Todas</button></li>
              <li class="hover:text-primary"><button>Vendidas</button></li>
              <li class="hover:text-primary"><button>Pendiente</button></li>
              <li class="hover:text-primary"><button>Borrador</button></li>
            </ul>
          </div>
        </section>

        <section
          class="relative flex w-full justify-between py-7 px-4 text-dark-strong transition-all duration-300 dark:text-light-medium lg:px-8"
        >
          <p>ID</p>
          <p class="hidden w-1/5 lg:block">Fecha</p>
          <p class="w-1/5">Empresa</p>
          <p class="w-1/5">Total</p>
          <p class="w-1/5">Status</p>
        </section>
        <section class="flex flex-col items-center gap-4" v-if="invoicesLoaded">
          <LoadingSpinner v-if="!invoices.length" />
          <MyInvoice v-for="invoice in invoices" :invoice="invoice" :key="invoice.id" />
          <!-- <InvoiceTable>
            <InvoiceRow v-for="invoice in invoices" :invoice="invoice" :key="invoice.id" />
          </InvoiceTable> -->
        </section>
      </div>

      <div v-if="invoiceData.length < 1" class="empty flex flex-col dark:text-light-strong">
        <img src="@/assets/images/illustration-empty.svg" alt="" />
        <h3>No hay cotizaciones</h3>
        <p>
          Crea una nueva cotización haciendo click en el botón
          <span class="text-primary dark:text-primary/50">+Cotización</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  color: #181818;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      // align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 11px;
        }
      }

      .filter {
        position: relative;
        // margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          z-index: 999;
          position: absolute;
          top: 25px;
          right: 0;
          list-style: none;
          // background-color: #fff;
          border-radius: 10px;
          // background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          @media (min-width: 768px) {
            right: -50px;
          }

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #dfa48c;
              border-radius: 10px;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #e90f02;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
