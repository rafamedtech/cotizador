<script setup>
// Dependencies imports
// import { useStore } from '@/stores/main';
// import { storeToRefs } from 'pinia';

const { editInvoice, invoiceDialog, modalActive } = storeToRefs(useStore());
const { editCurrentInvoice, toggleModal, toggleInvoice } = useStore();

const closeBtn = ref(null);

const closeModal = () => {
  toggleModal();
};

const closeInvoice = () => {
  toggleInvoice();
  closeModal();
  if (editInvoice.value) {
    editCurrentInvoice();
  }
};

async function closeInvoiceModal() {
  // invoiceDialog.value = false;
  modalActive.value = false;
  await navigateTo('/');
  // toggleModal();
  // closeBtn.value.click();
  // const html = document.querySelector('html');
  // html.style.overflowY = 'scroll';
}
</script>

<template>
  <div class="my-modal flex bg-[#1a1a1a]/50">
    <div class="modal-content bg-[#f2f2f2] dark:bg-[#222222]">
      <p class="dark:text-[#f2f2f2]">¿Seguro que quieres salir? Los cambios no serán guardados!</p>
      <div class="my-actions flex gap-2">
        <button
          @click="closeModal"
          class="btn border-none bg-light-strong text-[#1a1a1a] hover:bg-light-strong hover:text-primary focus:outline-primary"
        >
          Regresar
        </button>
        <button
          class="btn border-none bg-primary text-white hover:bg-primary/50 focus:outline-primary dark:bg-primary/50 dark:hover:bg-primary dark:hover:text-light-medium"
          @click="closeInvoiceModal"
        >
          Salir
        </button>
        <label ref="closeBtn" for="my-modal-3" class="hidden">✕</label>

        <!-- <label
            for="my-modal-3"
            class="btn border-none bg-primary text-light-medium hover:bg-primary/50 focus:outline-primary"
          >
            Salir
          </label> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-modal {
  z-index: 10000;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;

    color: #1a1a1a;

    p {
      text-align: center;
    }

    .my-actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
}
</style>
