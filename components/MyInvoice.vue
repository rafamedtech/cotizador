<script lang="ts" setup>
import type { InvoiceOutline } from '@/types/invoice';

defineProps<{
  invoice: InvoiceOutline;
}>();
</script>

<template>
  <NuxtLink
    :to="{ path: `/cotizacion/${invoice.invId}` }"
    class="relative flex h-24 w-full items-center justify-between gap-0 rounded-2xl bg-white py-7 px-4 text-dark-medium transition-all duration-300 hover:shadow-lg focus:outline-primary dark:bg-dark-strong dark:text-light-medium lg:overflow-y-hidden lg:px-8"
  >
    <p class="w-[5%] text-xs lg:w-[10%]">#{{ invoice.invId }}</p>
    <p class="w-[20%] text-xs lg:text-base">{{ invoice.invoiceDate }}</p>
    <p class="w-[30%] overflow-x-hidden text-xs lg:w-[25%] lg:text-base">
      {{ invoice.clientCompany }}
    </p>
    <Transition name="slide-up" appear>
      <div
        class="absolute right-0 -bottom-6 lg:static lg:w-[25%]"
        :style="{ transitionDelay: '300ms' }"
      >
        <StatusButton :status="invoice.status" />
      </div>
    </Transition>

    <p class="w-[20%] text-xs font-bold lg:text-base">
      {{
        new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(invoice.invoiceTotal)
      }}
    </p>
  </NuxtLink>
</template>
