<template>
  <main class="custom-container grid w-full place-content-center pb-[8rem]">
    <div class="stats stats-vertical mb-4 shadow-pinterest lg:stats-horizontal dark:bg-dark-strong">
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

    <section class="mt-8 flex flex-col gap-4">
      <h2 class="text-center text-2xl text-dark-medium dark:text-light-medium">
        Cotizaciones creadas por mes
      </h2>
      <Bar :data="chartData" />
    </section>
    <!-- <div class="flex"> -->

    <!-- <section class="mt-8 flex flex-col gap-4">
        <h2 class="text-center text-2xl text-dark-medium dark:text-light-medium">Por Etapa</h2>
        <DoughnutChart />
      </section> -->
    <!-- </div> -->
  </main>
</template>

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
