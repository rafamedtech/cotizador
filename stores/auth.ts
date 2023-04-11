import { defineStore } from 'pinia';

interface Credentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const { auth } = useSupabaseAuthClient();
  const user = useSupabaseUser();

  async function userLogin({ email, password }: Credentials) {
    try {
      const { error } = await auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }
  }

  async function userLogout() {
    try {
      const { error } = await auth.signOut();

      if (error) throw error;
    } catch (error) {
      console.log(error);
    }

    try {
      await $fetch('/api/_supabase/session', {
        method: 'POST',
        body: { event: 'SIGNED_OUT', session: null },
      });
      user.value = null;
    } catch (error) {
      console.error(error);
    }

    await navigateTo('/login');
  }

  return {
    userLogin,
    userLogout,
  };
});
