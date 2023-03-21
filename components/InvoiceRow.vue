<script setup lang="ts">
import type Invoice from '@/types/invoice';

defineProps<{
  invoice: Invoice;
}>();
</script>

<template>
  <tr class="hover">
    <th>{{ invoice.id }}</th>
    <td class="hidden lg:block">{{ invoice.paymentDueDate }}</td>
    <td>{{ invoice.clientCompany }}</td>
    <td>
      {{
        new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(invoice.invoiceTotal)
      }}
    </td>
    <td>
      <div>
        <!-- class="absolute inset-0 flex w-1/5 gap-2 rounded-[20px] py-2 px-4 lg:static lg:rounded-[10px] lg:px-8"
        :class="{
          paid: invoice.invoicePaid,
          draft: invoice.invoiceDraft,
          pending: invoice.invoicePending,
        }" -->
        <span class="flex items-center gap-2" v-if="invoice.invoicePaid">
          <Icon name="icon-park-outline:check-one" class="text-base text-green-500" />
          Vendido
        </span>
        <span
          class="flex items-center gap-2 text-gray-500 dark:text-dark-medium"
          v-if="invoice.invoiceDraft"
          ><Icon name="ri:draft-line" class="text-base" />Borrador</span
        >
        <span class="flex items-center gap-2" v-if="invoice.invoicePending">
          <Icon name="icon-park-outline:caution" class="text-base text-secondary" />Pendiente</span
        >
      </div>
    </td>
  </tr>
</template>
