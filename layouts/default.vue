<script setup>
const user = useSupabaseUser();
</script>

<template>
  <section class="app flex flex-col overflow-x-hidden">
    <NavBar v-if="user" />
    <div
      class="relative flex flex-[1] flex-col overflow-x-auto bg-light-medium p-0 transition-all dark:bg-dark-medium"
    >
      <slot></slot>
    </div>
  </section>
</template>
