<script setup>
const searchValue = ref('');

const emit = defineEmits(['@search']);

function onSearch(e) {
  searchValue.value = e.target.value;
  emit('@search', searchValue.value);
}
</script>

<template>
  <div class="form-control w-full max-w-xs">
    <label class="label">
      <span class="label-text text-dark-strong dark:text-light-medium">Buscar por cliente</span>
    </label>
    <input
      @input="onSearch"
      type="text"
      placeholder="Escribe aqui..."
      class="bg-opacity-20 input-primary input w-full rounded-xl border-none bg-white py-1 px-3 text-base leading-8 text-dark-medium outline-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-strong dark:text-light-strong"
    />
  </div>
</template>
