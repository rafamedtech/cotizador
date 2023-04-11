<script setup>
const error = useError();
</script>

<template>
  <NuxtLayout>
    <div
      v-if="error.statusCode === '404'"
      class="prose ml-40 grid w-full place-content-center text-dark-medium"
    >
      <h1>404</h1>
      <p>Lo sentimos, esta pagina no existe</p>
      <p>
        <strong>{{ error.message }}</strong>
      </p>
    </div>
    <div v-else class="prose ml-40 grid w-full place-content-center text-dark-medium">
      <p>Al parecer esta pagina no existe</p>
      <p>Lo sentimos mucho!</p>
      <p>
        <strong>{{ error.message }}</strong>
      </p>
    </div>
  </NuxtLayout>
</template>
