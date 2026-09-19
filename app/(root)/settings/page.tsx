import SettingsPage from '@/components/SettingsPage';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const Settings = async () => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect('/sign-in');

  return <SettingsPage user={loggedIn} />;
};

export default Settings;
