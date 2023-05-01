<script lang="ts" setup>
import type { InvoiceOutline } from '@/types/invoice';

const props = defineProps<{
  invoice: InvoiceOutline;
}>();

const store = useStore();
const { isLoadingFull } = storeToRefs(store);

const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

const dateFormatted = computed(() =>
  props.invoice.invoiceDate.toLocaleString('es-MX', dateOptions)
);
</script>

<template>
  <NuxtLink
    :to="{ path: `/cotizacion/${invoice.invId}` }"
    class="card w-full max-w-md border border-light-strong bg-white shadow-pinterest dark:border-dark-medium dark:bg-dark-strong"
    @click="isLoadingFull = true"
  >
    <div class="card-body">
      <span class="text-xs text-dark-medium dark:text-light-medium"
        ># <span class="text-primary">{{ invoice.invId }}</span></span
      >
      <span class="text-xs text-dark-medium dark:text-light-medium">
        <span class="font-bold">Fecha:</span> {{ invoice.invoiceDate }}</span
      >
      <h2 class="card-title text-primary">{{ invoice.clientCompany }}</h2>
      <p class="card-title text-dark-medium dark:text-light-medium">
        <span class="font-bold text-primary">Total:</span>
        {{
          new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
          }).format(invoice.invoiceTotal)
        }}
      </p>
      <div class="card-actions items-center justify-end">
        <button><StatusButton :status="invoice.status" /></button>
      </div>
    </div>
  </NuxtLink>
</template>
