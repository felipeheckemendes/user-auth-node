import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { useNavigate, useNavigation } from 'react-router';
import { useEffect, useState } from 'react';
import PasswordInput from '@/components/PasswordInput';
const apiUrl = import.meta.env.VITE_API_URL;

// Function to validate email address
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export default function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [errorMessage, setErrorMessage] = useState(' ');
  const navigate = useNavigate();
  const [navigation, setNavigation] = useState('idle');

  const signUp = async (event: { preventDefault: () => void; currentTarget: any }) => {
    setNavigation('submitting');
    event.preventDefault();
    setErrorMessage(' ');
    const formData = event.currentTarget;
    if (!validateEmail(formData.email.value)) {
      setErrorMessage('Please enter a valid email address.');
      setNavigation('idle');
      return false;
    }
    if (formData.password.value.length < 8) {
      setErrorMessage('Password should have at least 8 characters. Please try again.');
      setNavigation('idle');
      return false;
    }
    if (formData.password.value !== formData.passwordConfirm.value) {
      setErrorMessage('Passwords do not match. Please try again.');
      setNavigation('idle');
      return false;
    }
    const result = await fetch(`${apiUrl}signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email.value,
        password: formData.password.value,
        passwordConfirm: formData.passwordConfirm.value,
      }),
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
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Enter your email below to create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm font-semibold mb-2 text-left">{errorMessage}</p>
          <form onSubmit={signUp} method="post">
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passwordConfirm" className="font-normal">
                  Please Confirm your Password
                </Label>
                <PasswordInput id="passwordConfirm" type="password" required />
              </div>
              <Button
                variant="mainIndigo"
                type="submit"
                className="w-full"
                disabled={navigation === 'submitting'}
              >
                {navigation === 'submitting' ? 'Signing up' : 'Sign up'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
