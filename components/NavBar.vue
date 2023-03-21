<script setup>
import { useStore } from '@/stores/main';
import logo from '@/assets/images/Suntech-logo-cropped.png';

const isDark = useDark();
const toggleDark = useToggle(isDark);

// const { userLogout } = useStore();
const userLogout = () => {
  useStore().$patch({
    customModal: true,
    modalType: 'logout',
  });
};
</script>

<template>
  <header
    class="z-[99] flex w-full justify-between bg-dark-medium shadow-sm dark:bg-dark-strong md:fixed md:max-h-screen md:min-h-full md:min-w-[80px] md:flex-col lg:w-32 lg:shadow-lg"
  >
    <div class="flex h-16 w-fit items-center justify-center rounded-[10px] p-4 pt-6 lg:w-full">
      <img :src="logo" alt="" class="h-full w-auto" />
    </div>
    <div class="flex items-center gap-4 lg:mb-4 lg:flex-col">
      <ClientOnly>
        <button @click="toggleDark()" class="flex flex-col items-center gap-2">
          <!-- <i class="fa-solid fa-right-from-bracket text-2xl"></i> -->
          <Icon
            name="icon-park-outline:dark-mode"
            class="text-2xl text-primary dark:text-primary/50"
          />
          <p class="text-xs dark:text-light-medium">{{ isDark ? 'Light' : 'Dark' }} Mode</p>
        </button>
      </ClientOnly>
      <button @click="userLogout" class="flex flex-col items-center gap-2">
        <!-- <i class="fa-solid fa-right-from-bracket text-2xl"></i> -->
        <Icon name="icon-park-outline:logout" class="text-2xl text-primary dark:text-primary/50" />
        <p class="text-xs dark:text-light-medium">Cerrar sesión</p>
      </button>
    </div>
  </header>
</template>
