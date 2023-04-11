import type Contact from '@/types/contact';

// export default async () => useFetchWithCache<Contact>('/api/contacts');

export const useContact = async () => {
  const contactData = ref<Contact[]>([]);
  async function getContacts() {
    const { data, error } = await useFetch('/api/contacts');

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch data from endpoint`,
      });
    }

    contactData.value = data.value as Contact[];
  }

  await getContacts();

  return { contactData };
};
