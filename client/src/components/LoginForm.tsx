/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add other environment variables here...
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/PasswordInput';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

// Function to validate email address
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export default function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [errorMessage, setErrorMessage] = useState(' ');
  const navigate = useNavigate();
  const [navigation, setNavigation] = useState('idle');

  const logIn = async (event: { preventDefault: () => void; currentTarget: any }) => {
    setNavigation('submitting');
    event.preventDefault();
    setErrorMessage(' ');
    const formData = event.currentTarget;
    if (!validateEmail(formData.email.value)) {
      setErrorMessage('Please enter a valid email address.');
      setNavigation('idle');
      return false;
    }

    const result = await fetch(`${apiUrl}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email.value,
        password: formData.password.value,
      }),
      credentials: 'include',
    });
    const response = await result.json();
    console.log(response);
    if (response.status !== 'success') {
      setErrorMessage(response.message);
      setNavigation('idle');
      return false;
    }
    await navigate('/account/profile');
  };

  return (
    <div className={cn('flex flex-col gap-6 mt-24', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm font-semibold mb-2 text-left">{errorMessage}</p>
          <form onSubmit={logIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgotpassword"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput id="password" type="password" required />
              </div>
              <Button
                variant="mainIndigo"
                type="submit"
                className="w-full"
                disabled={navigation === 'submitting'}
              >
                {navigation === 'submitting' ? 'Logging in' : 'Log in'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
