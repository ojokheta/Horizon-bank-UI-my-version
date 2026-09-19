'use server';

import { cookies } from 'next/headers';
import { parseStringify } from '../utils';

// Temporary local auth: any email/password combo creates a session.
// Remove this bypass when Appwrite is restored.
const DEV_SESSION_COOKIE = 'horizon-dev-session';

const cookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

const buildDevUser = ({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}) => {
  const first = firstName?.trim() || email.split('@')[0] || 'Guest';
  const last = lastName?.trim() || 'User';

  return {
    $id: 'dev-user',
    userId: 'dev-user',
    email,
    firstName: first,
    lastName: last,
    name: `${first} ${last}`.trim(),
    dwollaCustomerUrl: '',
    dwollaCustomerId: '',
    address1: '',
    city: '',
    state: '',
    postalCode: '',
    dateOfBirth: '',
    ssn: '',
  };
};

const setDevSession = (user: ReturnType<typeof buildDevUser>) => {
  cookies().set(DEV_SESSION_COOKIE, JSON.stringify(user), cookieOptions);
};

const getDevSession = () => {
  const session = cookies().get(DEV_SESSION_COOKIE);

  if (!session?.value) return null;

  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
};

export const signIn = async ({ email }: signInProps) => {
  const user = buildDevUser({ email });
  setDevSession(user);
  return parseStringify(user);
};

export const signUp = async (userData: SignUpParams) => {
  const user = buildDevUser({
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });
  setDevSession(user);
  return parseStringify(user);
};

export async function getLoggedInUser() {
  const user = getDevSession();
  return user ? parseStringify(user) : null;
}

export const logoutAccount = async () => {
  cookies().delete(DEV_SESSION_COOKIE);
  cookies().delete('appwrite-session');
  return true;
};