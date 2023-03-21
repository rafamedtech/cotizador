<template>
  <div class="app flex flex-col overflow-x-hidden">
    <NavBar />
    <!-- <NavBar v-if="user" /> -->
    <slot></slot>
  </div>
</template>
