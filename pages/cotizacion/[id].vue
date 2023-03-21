<script lang="ts" setup>
// Imports
import { useStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
// import emailjs from "@emailjs/browser";

// Definitions
const { params } = useRoute();
const { user, invoiceData, currentInvoice } = storeToRefs(useStore());
const { editCurrentInvoice, toggleInvoice, updateStatusToPaid, updateStatusToPending } = useStore();

currentInvoice.value = invoiceData.value.find((invoice: any) => {
  return invoice.id.toString() === params.id.toString();
});

const toggleEditInvoice = () => {
  editCurrentInvoice();
  toggleInvoice();
};

const deleteInvoice = () => {
  useStore().$patch({
    customModal: true,
    modalType: 'delete',
  });
};

// const sendEmail = () => {
//   emailjs
//     .send(
//       "service_tyiaa8g",
//       "template_gw5kvf9",
//       {
//         customer_name: currentInvoice.value.clientName.split(" ")[0],
//         customer_name2: currentInvoice.value.clientName2
//           ? `/${currentInvoice.value.clientName2.split(" ")[0]}`
//           : "",
//         customer_email: currentInvoice.value.clientEmail,
//         customer_email2: currentInvoice.value.clientEmail2,
//         message: location.toString(),
//       },
//       "QyWKNAO42Ukv7v_0T"
//     )
//     .then(
//       (result) => {
//         console.log("SUCCESS!", result.text);
//       },
//       (error) => {
//         console.log("FAILED...", error.text);
//       }
//     );

//   setTimeout(() => {
//     useStore().$patch({
//       customModal: true,
//       modalType: "email",
//     });
//     if (currentInvoice.value.invoiceDraft) {
//       updateStatusToPending(currentInvoice.value.docId);
//     }
//   }, 1000);
// };
// const sendEmail = () => {
//   // const tempA = /*html*/ encodeURI(
//   //   `<a href="${location.toString()}">Abrir Cotización</a>`
//   // );
//   const tempBody = `Hola ${currentInvoice.value.clientName}${
//     currentInvoice.value.clientName2 ? "/" : ""
//   }${currentInvoice.value.clientName2},

// Tu cotización se encuentra disponible dando click en el siguiente enlace:

// ${location.toString()}

// Quedo a sus órdenes,
// GCO Soluciones Industriales`;

//   const body = encodeURI(tempBody);

//   const subject = "Tu cotización de GCO Soluciones Industriales esta lista!";

//   setTimeout(() => {
//     // useStore().$patch({
//     //   customModal: true,
//     //   modalType: "email",
//     // });
//     if (currentInvoice.value.invoiceDraft) {
//       updateStatusToPending(currentInvoice.value.docId);
//     }
//   }, 1000);

//   window.open(
//     `mailto:${currentInvoice.value.clientEmail}, ${currentInvoice.value?.clientEmail2}?subject=${subject}&bcc='orlando@gcosoluciones.com'&body=${body}`
//   );
// Email.send({
//   Host: "gcosoluciones.com",
//   Username: "no-reply@gcosoluciones.com",
//   Password: "RafaEL2022_eLL0q1ll0",
//   To: currentInvoice.value.clientEmail,
//   From: "no-reply@gcosoluciones.com",
//   Subject: "This is the subject",
//   Body: "And this is the body",
// }).then((message) => alert(message));
// };

const generatePDF = (): void => {
  useStore().$patch({
    customModal: true,
    modalType: 'print',
  });
};

definePageMeta({
  pageTransition: {
    name: 'slide',
    mode: 'out-in',
  },
});
</script>

<template>
  <main
    class="relative mx-auto min-h-screen w-full max-w-screen-lg px-4 pt-2 pb-6 print:px-10 lg:px-10"
  >
    <div v-if="currentInvoice" class="invoice-view my-container mb-4 print:hidden">
      <NuxtLink class="nav-link flex gap-2" :to="{ name: 'index' }">
        <Icon class="text-2xl text-primary" name="icon-park-outline:back" />
        <span class="text-dark-medium dark:text-light-strong">Regresar</span>
      </NuxtLink>
      <!-- Header -->
      <div class="header flex flex-col gap-4 bg-white shadow-lg dark:bg-dark-strong lg:flex-row">
        <!-- <div v-if="user" class="header flex flex-col gap-4 shadow-lg lg:flex-row"> -->
        <div class="left flex flex-col gap-2 lg:flex-row">
          <span class="text-dark-medium dark:text-light-strong">Etapa</span>
          <!-- <div class="status-button flex gap-2 py-2 px-4 lg:mr-2 lg:px-8"> -->
          <div
            class="status-button flex gap-2 py-2 px-4 lg:mr-2 lg:px-8"
            :class="{
              paid: currentInvoice.invoicePaid,
              draft: currentInvoice.invoiceDraft,
              pending: currentInvoice.invoicePending,
            }"
          >
            <!-- <span class="flex items-center gap-2"> -->
            <span class="flex items-center gap-2" v-if="currentInvoice.invoicePaid">
              <!-- <i class="fa-regular fa-circle-check text-base text-green-500"></i> -->
              <Icon name="icon-park-outline:check-one" class="text-base text-green-500" />
              Vendido
            </span>
            <span class="flex items-center gap-2" v-if="currentInvoice.invoiceDraft"
              ><Icon name="ri:draft-line" class="text-base text-gray-500" />Borrador</span
            >

            <span class="flex items-center gap-2" v-if="currentInvoice.invoicePending">
              <!-- <i class="fa-solid fa-circle-exclamation text-base text-secondary"></i> -->
              <Icon name="icon-park-outline:caution" class="text-base text-secondary" />
              Pendiente</span
            >
          </div>
        </div>

        <!-- Status bar -->
        <div class="right flex items-center justify-center gap-3">
          <button
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-[10px] border-none bg-[#f2f2f2] p-4 text-[9px] text-dark-medium transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-dark-medium lg:text-[10px]"
            @click="toggleEditInvoice"
          >
            <Icon
              name="icon-park-outline:edit"
              class="text-xl text-dark-medium dark:text-light-strong"
            />
            <span class="text-dark-medium dark:text-light-strong">Editar</span>
          </button>
          <button
            @click="deleteInvoice()"
            class="flex w-16 flex-col items-center justify-center gap-2 rounded-[10px] border-none bg-light-medium p-4 text-dark-medium transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-dark-medium dark:text-light-strong lg:text-[10px]"
          >
            <Icon class="text-xl text-primary" name="icon-park-outline:delete" />

            <span class="text-dark-medium dark:text-light-strong">Eliminar</span>
          </button>
          <!-- @click="updateStatusToPaid(currentInvoice.docId)" -->
          <button
            v-if="currentInvoice.invoicePending"
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-[10px] border-none bg-light-medium p-4 text-[9px] text-dark-medium transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-dark-medium dark:text-light-strong lg:text-[10px]"
            @click="updateStatusToPaid(currentInvoice?.id)"
          >
            <!-- <i class="fa-regular fa-circle-check text- text-green-500"></i> -->
            <Icon class="text-xl text-green-500" name="icon-park-outline:check-one" />
            Vendido
          </button>
          <!-- <button
            class="flex h-14 w-14 flex-col items-center justify-center gap-0 rounded-[10px] border-none bg-light-medium px-2 py-8 text-[9px] text-dark-medium transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-dark-medium dark:text-light-strong lg:text-[10px]"
          > -->
          <button
            v-if="currentInvoice.invoiceDraft || currentInvoice.invoicePaid"
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-[10px] border-none bg-[#f2f2f2] p-4 text-[9px] text-dark-medium transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-dark-medium lg:text-[10px]"
            @click="updateStatusToPending(currentInvoice.id)"
          >
            <!-- <i class="fa-solid fa-circle-exclamation text-base text-secondary"></i> -->
            <Icon class="text-xl text-secondary" name="icon-park-outline:caution" />
            <span class="text-dark-strong dark:text-light-strong">Pendiente</span>
          </button>
          <button
            @click="generatePDF"
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-[10px] border-none bg-light-medium p-4 text-[9px] text-dark-medium transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-dark-medium dark:text-light-strong lg:text-[10px]"
          >
            <!-- <i class="fa-solid fa-file-pdf text-base"></i> -->
            <Icon name="icon-park-outline:doc-detail" class="text-xl" />
            PDF
          </button>
          <!-- @click="sendEmail" -->
          <button
            class="flex w-16 flex-col items-center justify-center gap-1 rounded-[10px] border-none bg-light-medium p-4 text-[9px] text-dark-medium transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-dark-medium dark:text-light-strong lg:text-[10px]"
          >
            <!-- <i class="fa-regular fa-paper-plane text-base text-blue-500"></i> -->
            <Icon name="icon-park-outline:envelope-one" class="text-xl text-blue-500" />
            Enviar
          </button>
        </div>
      </div>
    </div>

    <!-- Cover -->

    <div
      class="relative mb-8 h-fit rounded-[20px] bg-white shadow-lg print:hidden lg:print:h-screen lg:print:w-screen"
      :class="{ hidden: user }"
    >
      <!-- <picture>
        <source media="(max-width: 767px)" srcset="@/assets/images/cover.jpg" />
        <img
          src="@/assets/images/cover.jpg"
          srcset="@/assets/images/cover.jpg"
          alt=""
          class="rounded-[20px]"
        />
      </picture> -->
    </div>
    <div
      class="relative mb-8 hidden h-fit bg-white print:hidden print:h-[700px] print:items-center print:justify-center"
    >
      <figure class="h-full">
        <img
          class="h-auto w-full rounded-[20px]"
          src="@/assets/images/cover.jpg"
          alt="cover image"
        />
      </figure>
    </div>

    <!-- Invoice body -->
    <div id="pdf-content" class="w-full">
      <section class="rounded-[20px] bg-white pt-4 shadow-lg dark:bg-dark-strong">
        <section class="relative flex h-full justify-between px-4 lg:px-8">
          <div class="mb-4 h-fit">
            <img
              class="my-4 mb-2 h-12 bg-dark-medium dark:bg-transparent"
              src="@/assets/images/Suntech-logo-cropped.png"
            />
            <span class="block text-xs font-bold text-primary dark:text-primary/50"
              >SUNTECH <span class="dark:text-light text-secondary">ELECTRONICS</span>
            </span>
            <p
              class="w-[40ch] text-[6px] text-dark-strong dark:text-light-strong print:w-[80ch] lg:w-[70ch]"
            >
              SISTEMAS DE CONTROL ELÉCTRICO, ELECTRÓNICO, NEUMÁTICO, AUTOMATIZACIÓN, FILTRACIÓN,
              CONTROL DE FLAMA, PRESIÓN, TEMPERATURA, BOMBEO, TRATAMIENTO DE AGUA Y ALMACENAMIENTO
            </p>
            <a
              class="text-[10px] text-dark-strong dark:text-light-strong"
              href="https://www.gcosoluciones.com"
              >www.suntechelectronics.com</a
            >
            <!-- <p class="text-[6px] leading-tight">ALMA PATRICIA GARCIA SOTELO</p>
            <p class="text-[6px] leading-tight text-secondary">RFC: GASA741127MJ4</p> -->
          </div>
          <h1
            class="absolute inset-0 top-2 hidden h-fit text-center text-xl font-bold uppercase italic text-primary dark:text-primary/50 lg:block"
          >
            Cotización
          </h1>
          <div class="flex flex-col items-end">
            <p class="dark:text-light font-bold uppercase text-dark-medium dark:text-light-strong">
              #{{ currentInvoice.id }}
            </p>
            <!-- <p class="font-bold uppercase">#{{ currentInvoice.invoiceId }}</p> -->

            <h3 class="text-[9px] text-primary dark:text-primary/50 lg:text-base">Fecha</h3>
            <!-- <p class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong">Fecha</p> -->
            <p class="dark:text-light-strongm text-[10px] text-dark-medium dark:text-light-strong">
              {{ currentInvoice?.invoiceDate }}
            </p>

            <h3 class="text-[9px] text-primary dark:text-primary/50 lg:text-base">Vigencia</h3>
            <!-- <p class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong">
              Vigencia
            </p> -->
            <p class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong">
              {{ currentInvoice?.paymentDueDate }}
            </p>

            <h3 class="text-[9px] text-primary dark:text-primary/50 lg:text-base">
              Tiempo de entrega
            </h3>
            <!-- <p class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong">
              Tiempo de entrega
            </p> -->
            <p class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong">
              {{ currentInvoice?.eta }}
            </p>
          </div>
        </section>

        <!-- Customer information section -->
        <section class="rounded-[20px] pb-4">
          <h2
            class="mx-auto mb-4 w-fit border-b-2 border-primary text-dark-strong dark:border-primary/50 dark:text-light-strong"
          >
            Información del cliente
          </h2>

          <ul class="grid grid-cols-3 px-4 text-[9px] print:grid-cols-5 lg:grid-cols-5 lg:px-8">
            <li class="text-center">
              <h3
                class="mb-2 border-b border-dark-strong text-[9px] text-primary dark:border-light-strong dark:text-primary/50 lg:text-base"
              >
                Nombre
              </h3>
              <p
                class="text-[8px] text-dark-strong dark:text-light-strong print:text-[8px] lg:text-xs"
              >
                <!-- Nombre -->
                {{ currentInvoice?.clientName }}
              </p>
              <p
                class="text-[8px] text-dark-strong dark:text-light-strong print:text-[8px] lg:text-xs"
              >
                <!-- Nombre 2 -->
                {{ currentInvoice?.clientName2 }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-b border-dark-strong text-[9px] text-primary dark:border-light-strong dark:text-primary/50 lg:text-base"
              >
                Empresa
              </h3>
              <p
                class="text-[8px] text-dark-strong dark:text-light-strong print:text-[8px] lg:text-xs"
              >
                <!-- Empresa -->
                {{ currentInvoice?.clientCompany }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-b border-dark-strong text-[9px] text-primary dark:border-light-strong dark:text-primary/50 lg:text-base"
              >
                Forma de pago
              </h3>
              <p
                class="text-[8px] text-dark-strong dark:text-light-strong print:text-[8px] lg:text-xs"
              >
                <!-- Forma de pago -->
                {{ currentInvoice?.paymentType }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-b border-dark-strong text-[9px] text-primary dark:border-light-strong dark:text-primary/50 lg:text-base"
              >
                Moneda
              </h3>
              <p
                class="text-[8px] text-dark-strong dark:text-light-strong print:text-[8px] lg:text-xs"
              >
                <!-- Moneda -->
                {{ currentInvoice?.currencyType }}
              </p>
            </li>
            <li class="text-center">
              <h3
                class="mb-2 border-b border-dark-strong text-[9px] text-primary dark:border-light-strong dark:text-primary/50 lg:text-base"
              >
                Tipo de cambio
              </h3>
              <p
                class="text-[8px] text-dark-strong dark:text-light-strong print:text-[8px] lg:text-xs"
              >
                <!-- Exchange -->
                {{ currentInvoice?.exchangeCost ? '$' : '' }}{{ currentInvoice?.exchangeCost }}
              </p>
            </li>
          </ul>
        </section>
      </section>

      <!-- Items table -->
      <section
        class="relative mt-4 max-h-[240px] min-h-[240px] overflow-x-auto rounded-[20px] bg-white shadow-lg dark:bg-dark-strong"
      >
        <div
          class="flex w-[150vw] justify-between gap-2 px-4 text-[10px] print:w-full lg:w-full lg:justify-between lg:gap-2 lg:px-8"
        >
          <!-- <h5 class="w-6 py-2 font-bold text-primary">ID</h5> -->
          <h5
            class="py-2 font-bold text-primary dark:text-primary/50 print:w-1/12 print:basis-1/12 lg:basis-[10%]"
          >
            No parte
          </h5>
          <div class="w-72 print:w-7/12 lg:basis-5/12">
            <h5 class="w-full py-2 text-center font-bold text-primary dark:text-primary/50">
              Descripción
            </h5>
          </div>
          <h5
            class="py-2 text-center font-bold text-primary dark:text-primary/50 print:w-1/12 lg:basis-1/12"
          >
            Cantidad
          </h5>
          <h5
            class="py-2 text-center font-bold text-primary dark:text-primary/50 print:w-2/12 lg:basis-3/12"
          >
            Precio unitario
          </h5>
          <h5 class="w-12 py-2 text-right font-bold text-primary dark:text-primary/50 print:w-1/12">
            Importe
          </h5>
        </div>
        <!-- <div
          class="flex w-[150vw] justify-between gap-2 px-4 text-[10px] print:w-full lg:w-full lg:justify-between lg:gap-2 lg:px-8"
        > -->
        <div
          class="flex w-[150vw] justify-between gap-2 px-4 text-[10px] print:w-full lg:w-full lg:justify-between lg:gap-2 lg:px-8"
          v-for="(item, index) in currentInvoice?.invoiceItemList"
          :key="index"
        >
          <!-- <p class="w-6 py-2">{{ item.id }}</p> -->
          <p
            class="py-2 text-dark-strong dark:text-light-strong print:w-1/12 print:basis-1/12 print:text-[8px] lg:basis-[10%]"
          >
            <!-- Numero de parte -->
            {{ item.partNo }}
          </p>
          <div class="w-72 print:w-7/12 lg:basis-5/12">
            <p
              class="w-full py-2 text-left text-dark-strong dark:text-light-strong print:text-[8px]"
            >
              <!-- Nombre del item -->
              {{ item.itemName }}
            </p>
          </div>
          <p
            class="py-2 text-center text-dark-strong dark:text-light-strong print:w-1/12 lg:basis-1/12"
          >
            <!-- Cantidad -->
            {{ item.qty }}
          </p>
          <p
            class="py-2 text-center text-dark-strong dark:text-light-strong print:w-2/12 lg:basis-3/12"
          >
            {{
              new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(item.price)
            }}
          </p>
          <p class="w-12 py-2 text-right text-dark-strong dark:text-light-strong print:w-1/12">
            {{
              new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
              }).format(item.total)
            }}
          </p>
        </div>
      </section>

      <!-- Terms and total sections -->
      <section
        class="flex max-h-40 w-full flex-col-reverse gap-4 overflow-y-hidden py-4 print:flex-row lg:flex-row"
      >
        <section
          class="flex w-full flex-col gap-4 overflow-y-hidden rounded-[20px] bg-white px-6 py-4 shadow-lg dark:bg-dark-strong print:w-3/5 print:basis-4/5 print:flex-row print:pr-0 lg:w-4/5 lg:flex-row"
        >
          <div class="overflow-y-hidden print:w-3/5 lg:w-1/2">
            <h3
              class="mb-2 w-fit border-b-2 border-primary text-dark-strong dark:border-primary/50 dark:text-light-strong"
            >
              Condiciones del servicio
            </h3>
            <p
              class="w-[50ch] text-[8px] italic text-dark-strong dark:text-light-strong print:w-full print:text-[6px]"
            >
              AGRADECIENDO SU AMABLE PREFERENCIA NOS ES GRATO SOMETER A SU CONSIDERACION NUESTRA
              COTIZACION DE ACUERDO A SU REQUERIMIENTO, ESPERANDO SEA SATISFACTORIA A SUS
              NECESIDADES, LOS PRECIOS MENCIONADOS ESTAN SUJETOS A ALTERACIONES. POR LO ANTERIOR,
              QUEDAMOS A SUS ORDENES PARA CUALQUIER DUDA O ACLARACION AL RESPECTO.
            </p>
          </div>
          <div class="w-1/2">
            <h3
              class="mb-2 w-fit border-b-2 border-primary text-dark-strong dark:border-primary/50 dark:text-light-strong"
            >
              Notas:
            </h3>
            <p
              class="h-12 w-[50ch] overflow-hidden text-[8px] uppercase italic text-dark-strong dark:text-light-strong print:w-full print:text-[6px]"
            >
              <!-- Notas -->
              {{ currentInvoice?.notes }}
            </p>
          </div>
        </section>
        <section
          class="flex w-full basis-[20%] flex-col justify-center rounded-[20px] bg-white px-6 py-4 shadow-lg dark:bg-dark-strong print:basis-1/5 print:px-4 lg:w-1/5"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-2">
              <p class="text-xs text-primary dark:text-primary/50">Subtotal</p>
              <p class="text-xs text-primary dark:text-primary/50">IVA 16%</p>
            </div>
            <div class="flex flex-col items-end gap-2 text-xs">
              <p class="text-dark-strong dark:text-light-strong">
                <!-- Subtotal -->
                {{
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(currentInvoice?.invoiceSubtotal as number)
                }}
              </p>
              <p class="text-dark-strong dark:text-light-strong">
                <!-- Tax -->
                {{
                  new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                  }).format(currentInvoice?.invoiceTax as number)
                }}
              </p>
            </div>
          </div>
          <div class="divide divider my-0 w-full"></div>
          <div class="flex w-full justify-between font-bold">
            <p class="text-primary dark:text-primary/50">Total</p>
            <p class="text-dark-strong dark:text-light-strong">
              <!-- Total -->
              {{
                new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                }).format(currentInvoice?.invoiceTotal as number)
              }}
            </p>
          </div>
        </section>
      </section>
    </div>
    <!-- :class="{ hidden: user }" -->
    <section class="mt-8 hidden lg:print:h-screen lg:print:w-screen">
      <!-- <img src="../assets/logo-bgremoved.png" class="mb-2 h-24" alt="" /> -->
      <div
        class="relative flex w-full flex-col items-center rounded-[20px] bg-white py-8 px-8 text-xs shadow-lg dark:bg-dark-strong print:h-[500px] print:max-h-[500px] lg:h-[70vh] lg:text-base"
      >
        <h2
          class="inset-0 top-4 h-fit text-center text-xl font-bold uppercase italic text-primary dark:text-primary/50 print:block lg:block"
        >
          Ficha Técnica
        </h2>
        <section class="h-full overflow-hidden">
          <div class="container mx-auto h-full px-5 py-8">
            <div
              class="mx-auto flex h-full flex-col items-center justify-center gap-8 print:w-full print:flex-row print:flex-nowrap lg:flex-row"
            >
              <!-- <figure
                v-if="currentInvoice.features.image"
                class="h-full rounded"
                :class="{
                  'print:h-auto print:w-1/2 lg:w-auto': currentInvoice.features.text,
                  'mx-auto print:h-auto print:w-1/2 lg:h-full lg:w-full':
                    !currentInvoice.features.text,
                }"
              >
                <img class="h-full w-full" alt="ecommerce" :src="currentInvoice.features.image" />
              </figure> -->
              <!-- <div
                v-if="currentInvoice.features.text"
                class="w-full basis-1/2 leading-tight lg:mt-0 lg:w-1/2"
              >
                <p class="mx-auto h-full w-full basis-1/2 text-[10px]">
                  {{ currentInvoice.features.text }}
                </p>
              </div> -->
            </div>
          </div>
        </section>
      </div>
      <!-- <section class="mt-4 flex justify-end">
        <ul class="mr-0 flex gap-8">
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'nuevo'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i v-else class="fa-regular fa-circle-xmark text-xl text-red-500"></i>
            Nuevo
          </li>
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'usado'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i v-else class="fa-regular fa-circle-xmark text-xl text-red-500"></i>
            Usado
          </li>
          <li class="flex items-center gap-2">
            <i
              v-if="currentInvoice.condition === 'refurbished'"
              class="fa-regular fa-circle-check text-xl text-green-500"
            ></i>
            <i v-else class="fa-regular fa-circle-xmark text-xl text-red-500"></i>
            Refurbished
          </li>
        </ul>
      </section> -->
    </section>

    <!-- Crear PDF usuario -->
    <div class="pdf flex justify-center print:hidden" v-if="!user">
      <button
        @click="generatePDF"
        class="mt-8 flex h-14 w-40 flex-row items-center justify-center gap-2 rounded-[10px] border-none bg-primary px-10 py-6 text-xs text-white transition-all hover:-translate-y-[1px] hover:shadow-lg dark:bg-primary/50"
      >
        <i class="fa-solid fa-file-pdf text-lg"></i>
        Crear PDF
      </button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.pdf {
  @media print {
    display: none;
  }
}
.invoice-view {
  .nav-link {
    margin-top: 16px;
    margin-bottom: 32px;
    align-items: center;
    // color: #1a1a1a;
    font-size: 12px;
    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    // background-color: #fff;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        // color: #1a1a1a;
        // color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      // button {
      //   color: #fff;
      // }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;
        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }
        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          // font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>
