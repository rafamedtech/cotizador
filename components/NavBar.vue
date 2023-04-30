<script lang="ts" setup>
import { Modal } from '@/types/modal';

const store = useStore();
const { modalType, backBtn } = storeToRefs(store);
const isDark = useDark();
const toggleDark = useToggle(isDark);

// const modalBtn = ref<HTMLInputElement | null>(null);
const mobileMenu = ref(false);
function toggleMenu() {
  mobileMenu.value = !mobileMenu.value;
}

const userLogout = () => {
  // modalType.value = Modal.Logout;
  store.$patch({
    modalType: Modal.Logout,
  });
  setTimeout(() => {
    backBtn.value?.click();
  }, 500);
};
</script>

<template>
  <header
    class="z-[99] flex w-full justify-between bg-dark-medium shadow-sm dark:bg-dark-strong print:hidden md:fixed md:max-h-screen md:min-h-full md:min-w-[80px] md:flex-col lg:w-32 lg:shadow-lg"
  >
    <section class="flex w-full items-center justify-between px-2 lg:block lg:w-auto">
      <div class="flex h-16 w-fit items-center justify-center rounded-[10px] p-4 pt-6 lg:w-full">
        <img src="@/assets/images/Suntech-logo-cropped.png" alt="" class="h-full w-auto" />
      </div>
      <button
        type="button"
        @click="userLogout"
        class="flex cursor-pointer flex-col items-center gap-2 lg:hidden"
      >
        <label ref="modalBtn" for="my-modal-6" class="hidden"></label>
        <Icon
          name="material-symbols:logout-rounded"
          class="text-3xl text-primary dark:text-primary/50"
        />
        <p class="text-xs dark:text-light-medium">Cerrar sesión</p>
      </button>

      <div class="hidden lg:divider"></div>
      <section class="nav-links hidden flex-col lg:flex">
        <NuxtLink
          :to="{ name: 'index' }"
          class="mb-8 flex cursor-pointer flex-col items-center gap-2"
        >
          <label ref="modalBtn" for="my-modal-6" class="hidden"></label>
          <Icon name="material-symbols:home-outline-rounded" class="text-3xl text-primary/50" />
          <p class="text-xs dark:text-light-medium">Inicio</p>
        </NuxtLink>
        <NuxtLink
          :to="{ name: 'cotizaciones' }"
          class="flex cursor-pointer flex-col items-center gap-2"
        >
          <label ref="modalBtn" for="my-modal-6" class="hidden"></label>
          <Icon name="tabler:file-invoice" class="text-3xl text-primary/50" />
          <p class="text-xs dark:text-light-medium">Cotizaciones</p>
        </NuxtLink>
      </section>
    </section>

    <div class="hidden items-center gap-4 lg:mb-8 lg:flex lg:flex-col">
      <div class="divider"></div>
      <ClientOnly>
        <button @click="toggleDark()" class="flex flex-col items-center gap-2">
          <!-- <i class="fa-solid fa-right-from-bracket text-2xl"></i> -->
          <Icon
            :name="
              isDark
                ? 'material-symbols:lightbulb-circle-outline-rounded'
                : 'material-symbols:nightlight-badge-rounded'
            "
            class="text-3xl text-primary dark:text-primary/50"
          />
          <p class="text-xs dark:text-light-medium">{{ isDark ? 'Light' : 'Dark' }} Mode</p>
        </button>
      </ClientOnly>
      <button
        type="button"
        @click="userLogout"
        class="flex cursor-pointer flex-col items-center gap-2"
      >
        <label ref="modalBtn" for="my-modal-6" class="hidden"></label>
        <Icon
          name="material-symbols:logout-rounded"
          class="text-3xl text-primary dark:text-primary/50"
        />
        <p class="text-xs dark:text-light-medium">Cerrar sesión</p>
      </button>
    </div>

    <!-- Mobile menu -->

    <div class="btm-nav bg-dark-strong pt-1 lg:hidden">
      <NuxtLink :to="{ name: 'index' }">
        <Icon
          name="material-symbols:home-outline-rounded"
          class="text-2xl text-primary dark:text-primary/50"
        />
        <span class="btm-nav-label text-light-medium">Inicio</span>
      </NuxtLink>
      <NuxtLink :to="{ name: 'cotizaciones' }" class="">
        <Icon name="tabler:file-invoice" class="text-2xl text-primary dark:text-primary/50" />
        <span class="btm-nav-label text-light-medium">Cotizaciones</span>
      </NuxtLink>
      <button @click="toggleDark()">
        <ClientOnly>
          <Icon
            :name="
              isDark
                ? 'material-symbols:lightbulb-circle-outline-rounded'
                : 'material-symbols:nightlight-badge-rounded'
            "
            class="text-2xl text-primary dark:text-primary/50"
          />
          <span class="btm-nav-label text-light-medium">{{ isDark ? 'Light' : 'Dark' }} Mode</span>
        </ClientOnly>
      </button>
    </div>
  </header>
</template>

<style scoped>
.nav-links a.router-link-exact-active svg,
.nav-links a.router-link-active svg {
  @apply active text-primary;
}

.nav-links a.router-link-exact-active p,
.nav-links a.router-link-active p {
  @apply active border-b border-primary;
}

.btm-nav .nav-links a.router-link-exact-active span,
.btm-nav .nav-links a.router-link-active span {
  @apply active text-primary;
}

.router-link-exact-active,
.router-link-active {
  @apply active;
}

.active {
  @apply border-primary bg-transparent;
}
</style>
