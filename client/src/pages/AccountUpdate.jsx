// REACT
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
// UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PasswordInput from '@/components/PasswordInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
// COMPONENTS
import UpdateUserInfoForm from '../components/UpdateUserInfoForm';
import UpdateUserEmailForm from '@/components/UpdateUserEmailForm';
import UpdateUserPasswordForm from '@/components/UpdateUserPasswordForm';
import UserDeleteAccountForm from '@/components/UserDeleteAccountForm';
// ASSETS
import userPlaceholder from '@/assets/user-placeholder.svg';
// ENV
const apiUrl = import.meta.env.VITE_API_URL;

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
