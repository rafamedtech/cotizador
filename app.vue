<script setup>
// Dependencies imports
import { useStore } from '@/stores/main';
import { storeToRefs } from 'pinia';

// Definitions
const { invoiceDialog, modalActive, customModal, invoicesLoaded, user } = storeToRefs(useStore());
// const { getInvoices, fetchUser } = useStore();

// getInvoices();
// fetchUser();
</script>

<template>
  <div>
    <NuxtLayout>
      <div
        class="relative flex flex-[1] flex-col overflow-x-auto bg-light-medium p-0 transition-all duration-300 dark:bg-[#222222]"
      >
        <MyModal v-if="modalActive" />
        <CustomModal v-if="customModal" />
        <Transition name="invoice">
          <InvoiceModal v-if="invoiceDialog" />
        </Transition>
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
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

.invoice-enter-active,
.invoice-leave-active {
  transition: 0.4s ease all;
}

.invoice-enter-from,
.invoice-leave-to {
  transform: translateX(-700px);
}
// .page-move,
.page-enter-active,
.page-leave-active {
  transition: 0.4s ease-out all;
}

.page-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}
.page-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

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

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: none;
    // margin-right: 8px;
  }
  @media (min-width: 900px) {
    display: initial;
    inset: initial;
    width: 10rem;
    justify-content: center;
  }
  font-size: 12px;
  // margin-right: 30px;
  align-items: center;
  // margin: 0 auto;
  // text-align: center;
  // padding: 8px 30px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #29b385;
    // background-color: #33d69f;
  }
  color: #29b385;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }
  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #747680;
    // background-color: #dfe3fa;
  }
  color: #747680;
  // color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.5);
}
</style>
