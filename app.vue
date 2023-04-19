<script setup>
const store = useStore();
const { isLoadingFull, openAlert } = storeToRefs(store);
</script>

<template>
  <main class="relative">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ScreenLoader v-if="isLoadingFull" />
    <AppModal />
    <Transition name="alert">
      <AlertCard v-if="openAlert" />
    </Transition>
  </main>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.app {
  min-height: 100vh;
  @media (min-width: 900px) {
    flex-direction: row !important;
  }
}

// animated invoice

// .page-enter-active,
// .page-leave-active {
//   transition: 0.3s ease all;
// }

// .page-enter-from {
//   transform: translateX(-30px);
//   opacity: 0;
// }
// .page-leave-to {
//   transform: translateX(30px);
//   opacity: 0;
// }

// utility classes

.custom-container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding-left: 100px;
    padding-right: 100px;
  }

  @media (min-width: 900px) {
    padding: 72px 10px 40px 10px;
  }
}

// Status Button Styling

// .status-button {
//   &::before {
//     content: '';
//     width: 10px;
//     height: 10px;
//     border-radius: 50%;
//     display: none;
//   }
//   @media (min-width: 900px) {
//     display: initial;
//     inset: initial;
//     width: 10rem;
//     justify-content: center;
//   }
//   font-size: 12px;
//   align-items: center;
//   border-radius: 10px;
// }

// .paid {
//   &::before {
//     background-color: #29b385;
//   }
//   color: #29b385;
//   background-color: rgba(51, 214, 160, 0.1);
// }

// .pending {
//   &::before {
//     background-color: #ff8f00;
//   }
//   color: #ff8f00;
//   background-color: rgba(255, 145, 0, 0.1);
// }
// .canceled {
//   &::before {
//     @apply bg-red-500;
//   }
//   @apply bg-red-500/10 text-red-500;
// }

// .draft {
//   &::before {
//     background-color: #747680;
//   }
//   // color: #747680;
//   @apply text-[#747680] dark:bg-[#747680]/50 dark:text-light-medium;
//   background-color: rgba(223, 227, 250, 0.5);
// }
</style>
