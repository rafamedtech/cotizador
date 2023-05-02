<script lang="ts" setup>
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

const { invoices } = await useInvoices();
const vendidas = computed(() => invoices.value.filter((invoice) => invoice.status === 'Vendida'));
const pendientes = computed(() =>
  invoices.value.filter((invoice) => invoice.status === 'Pendiente')
);
const canceladas = computed(() =>
  invoices.value.filter((invoice) => invoice.status === 'Cancelada')
);

const totalInvoiceAmount = computed(() => {
  return invoices.value
    .filter((invoice) => invoice.status === 'Vendida')
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});
const totalPendingInvoiceAmount = computed(() => {
  return invoices.value
    .filter((invoice) => invoice.status === 'Pendiente')
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});
const totalCanceledInvoiceAmount = computed(() => {
  return invoices.value
    .filter((invoice) => invoice.status === 'Cancelada')
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});

const store = useStore();
const { contactData } = storeToRefs(store);
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map((clientCompany) => {
    return contactData.value.find((a) => a.clientCompany === clientCompany);
  })
);

const filteredContacts = ref([]);

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
const chartData = reactive({
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Cotizaciones',
      backgroundColor: '#fe6847',
      data: [40, 20, 12, 15, 25, 30],
    },
  ],
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
  <main class="custom-container grid place-content-center pb-[8rem]">
    <h1 class="text-2xl text-primary dark:text-primary/50 lg:text-3xl">Inicio</h1>
    <div
      class="stats stats-vertical my-4 min-w-[90vw] border border-light-strong shadow-pinterest lg:stats-horizontal dark:border-dark-medium dark:bg-dark-strong lg:min-w-full"
    >
      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">{{ invoices.length }}</div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">Jan 1st - Feb 1st</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Vendidas</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">{{ vendidas.length }}</div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">↗︎ 400 (22%)</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Pendientes</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">
          {{ pendientes.length }}
        </div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">↘︎ 90 (14%)</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Canceladas</div>
        <div class="stat-value text-dark-medium dark:text-light-strong">
          {{ canceladas.length }}
        </div>
        <!-- <div class="stat-desc text-dark-medium dark:text-light-medium">↘︎ 90 (14%)</div> -->
      </div>
    </div>

    <div
      class="stats stats-vertical mb-4 border border-light-strong shadow-pinterest lg:stats-horizontal dark:border-dark-medium dark:bg-dark-strong"
    >
      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total Vendido $</div>
        <div class="stat-value text-dark-medium dark:text-light-medium">
          {{
            new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(totalInvoiceAmount)
          }}
        </div>
        <!-- <div class="stat-desc">Jan 1st - Feb 1st</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total Pendiente $</div>
        <div class="stat-value text-dark-medium dark:text-light-medium">
          {{
            new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(totalPendingInvoiceAmount)
          }}
        </div>
        <!-- <div class="stat-desc">↗︎ 400 (22%)</div> -->
      </div>

      <div class="stat place-items-center">
        <div class="stat-title text-primary dark:text-primary/50">Total Cancelado</div>
        <div class="stat-value text-dark-medium dark:text-light-medium">
          {{
            new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(totalCanceledInvoiceAmount)
          }}
        </div>
        <!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
      </div>
    </div>
    <section class="container mt-8 flex flex-col gap-4">
      <h2 class="text-center text-2xl text-dark-medium dark:text-light-medium">Ultimos clientes</h2>
      <!-- <Bar :data="chartData" /> -->
      <div
        v-if="uniqueContacts.length"
        class="stats stats-vertical w-full max-w-2xl text-dark-medium shadow-pinterest dark:bg-dark-strong"
      >
        <div class="stat lg:flex" v-for="contact in uniqueContacts">
          <div class="w-1/2">
            <div class="stat-title text-base text-primary">Empresa</div>
            <div class="stat-value text-lg dark:text-light-medium">
              {{ contact?.clientCompany }}
            </div>
          </div>
          <div class="w-1/2">
            <div class="stat-title text-base text-primary">Contacto</div>
            <div class="stat-value text-lg text-dark-medium dark:text-light-medium">
              {{ contact?.clientName }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="stats min-h-16 stats-vertical grid w-full max-w-2xl place-items-center text-primary shadow dark:bg-dark-strong dark:text-primary/50"
        v-else
      >
        No hay clientes
      </div>
    </section>
  </main>
</template>

<style scoped>
.table :where(tbody th, tbody td) {
  @apply bg-base-100 text-dark-medium dark:bg-dark-strong dark:text-light-medium;
}
</style>
