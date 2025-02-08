// COMPONENTS
import UpdateUserInfoForm from '../components/UpdateUserInfoForm';
import UpdateUserEmailForm from '@/components/UpdateUserEmailForm';
import UpdateUserPasswordForm from '@/components/UpdateUserPasswordForm';
import UserDeleteAccountForm from '@/components/UserDeleteAccountForm';

export default function AccountUpdate({ user, setUser }) {
  return (
    <>
      <UpdateUserInfoForm user={user} setUser={setUser} />

      <UpdateUserEmailForm user={user} setUser={setUser} />

      <UpdateUserPasswordForm user={user} setUser={setUser} />

      <UserDeleteAccountForm user={user} setUser={setUser} />
    </>
  );
}
