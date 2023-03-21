<script setup>
defineProps(['invoice']);
</script>

<template>
  <NuxtLink
    :to="{ path: `/cotizacion/${invoice.id}` }"
    class="relative flex w-full items-center justify-between rounded-2xl bg-white py-7 px-4 transition-all duration-300 hover:shadow-lg focus:outline-primary dark:bg-dark-strong dark:text-light-medium lg:px-8"
  >
    <span class="text-[8px] lg:text-xs">#{{ invoice.id }}</span>
    <span class="due-date hidden w-1/5 lg:block">{{ invoice.paymentDueDate }}</span>
    <span class="person w-1/5 text-xs lg:text-base">{{ invoice.clientCompany }}</span>
    <span class="w-1/5">{{
      new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(invoice.invoiceTotal)
    }}</span>

    <div
      class="status-button absolute inset-0 flex w-1/5 gap-2 rounded-[20px] py-2 px-4 lg:static lg:rounded-[10px] lg:px-8"
      :class="{
        paid: invoice.invoicePaid,
        draft: invoice.invoiceDraft,
        pending: invoice.invoicePending,
      }"
    >
      <span class="hidden items-center gap-2 lg:flex" v-if="invoice.invoicePaid">
        <Icon name="icon-park-outline:check-one" class="text-base text-green-500" />
        Vendido
      </span>
      <span
        class="hidden items-center gap-2 text-gray-500 dark:text-dark-medium lg:flex"
        v-if="invoice.invoiceDraft"
        ><Icon name="ri:draft-line" class="text-base" />Borrador</span
      >
      <span class="hidden items-center gap-2 lg:flex" v-if="invoice.invoicePending">
        <Icon name="icon-park-outline:caution" class="text-base text-secondary" />Pendiente</span
      >
    </div>
  </NuxtLink>
</template>
