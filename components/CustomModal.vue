<script setup lang="ts">
// Imports
import { useStore } from '@/stores/main';
import { storeToRefs } from 'pinia';

// Definitions
const { currentInvoice, modalType } = storeToRefs(useStore());
const { deleteCurrentInvoice, userLogout } = useStore();

const isLoading = ref(false);

const closeModal = () => {
  useStore().$patch({
    customModal: false,
  });
};

const deleteInvoice = async () => {
  deleteCurrentInvoice(currentInvoice.value?.id as number);
  closeModal();
  await navigateTo('/');
};

const toggleUserLogout = () => {
  isLoading.value = true;
  setTimeout(() => {
    userLogout();
    closeModal();
  }, 1000);
};

const createPDF = () => {
  closeModal();
  setTimeout(() => {
    window.print();
  }, 500);
};
</script>

<template>
  <div class="fixed z-[100] flex h-screen w-full items-center justify-center bg-[#1a1a1a]/50">
    <div class="bg-light m-4 max-w-md rounded-2xl bg-light-medium py-12 px-8 dark:bg-[#222222]">
      <!-- Email dialog -->
      <div v-if="modalType === 'email'">
        <p class="text-dark-medium dark:text-light-strong">
          La cotización fue enviada exitosamente a los siguientes correos:
        </p>
        <div class="mx-auto w-full text-center">
          <span class="italic text-primary">{{ currentInvoice?.clientEmail }}</span>
          <br />
          <span v-if="currentInvoice?.clientEmail2" class="italic text-primary">{{
            currentInvoice?.clientEmail2
          }}</span>
        </div>
        <div class="mx-auto mt-6 flex w-fit gap-2">
          <button
            @click="closeModal"
            class="btn flex-[1] border-none bg-primary text-white hover:bg-secondary focus:outline-primary"
          >
            Aceptar
          </button>
        </div>
      </div>

      <!-- PDF dialog -->
      <div v-if="modalType === 'print'">
        <p class="text-dark-medium dark:text-light-strong">
          Asegúrate de elegir <strong>"Guardar como PDF"</strong> en el destino.
        </p>
        <figure class="my-4">
          <img class="rounded-[20px]" src="@/assets/images/print.png" alt="" />
        </figure>
        <div class="mx-auto mt-6 flex w-fit gap-2">
          <button
            @click="closeModal"
            class="btn flex-[1] border-none bg-light-strong text-[#1a1a1a] hover:bg-light-strong hover:text-primary focus:outline-primary"
          >
            Regresar
          </button>
          <button
            @click="createPDF"
            class="btn flex-[1] border-none bg-primary text-light-medium hover:bg-primary/50 focus:outline-primary dark:bg-primary/50 dark:hover:bg-primary"
          >
            Aceptar
          </button>
        </div>
      </div>

      <!-- Delete dialog -->
      <div v-if="modalType === 'delete'">
        <p class="text-dark-medium dark:text-light-strong">
          ¿Seguro que deseas eliminar la cotización?
        </p>
        <div class="mx-auto mt-6 flex w-full gap-2">
          <button
            @click="closeModal"
            class="btn flex-[1] border-none bg-light-strong text-dark-medium hover:bg-light-strong hover:text-primary focus:outline-primary"
          >
            Regresar
          </button>
          <button
            @click="deleteInvoice"
            class="btn flex-[1] border-none bg-primary text-light-medium hover:bg-primary/50 focus:outline-primary dark:bg-primary/50 dark:hover:bg-primary"
          >
            Aceptar
          </button>
        </div>
      </div>

      <!-- Logout dialog -->
      <div v-if="modalType === 'logout'">
        <p class="text-dark-medium dark:text-light-strong">¿Seguro que deseas cerrar sesión?</p>
        <div class="mx-auto mt-6 flex w-full gap-2">
          <button
            @click="closeModal"
            class="btn flex-[1] border-none bg-light-strong text-[#1a1a1a] hover:bg-light-strong hover:text-primary focus:outline-primary"
          >
            Regresar
          </button>
          <button
            @click="toggleUserLogout"
            class="btn flex-[1] border-none bg-primary text-light-medium hover:bg-primary/50 focus:outline-primary dark:bg-primary/50 dark:hover:bg-primary"
          >
            <Loader v-if="isLoading" />
            <span v-else>Aceptar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
