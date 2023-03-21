<template>
  <div class="w-full overflow-x-auto">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr class="text-light-medium">
          <th>ID</th>
          <th class="hidden lg:block">Fecha</th>
          <th>Empresa</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>
