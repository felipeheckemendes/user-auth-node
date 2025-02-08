// REACT
import { useNavigate } from 'react-router';
import { useState } from 'react';
// UI
import { Button } from '@/components/ui/button';
import PasswordInput from '@/components/PasswordInput';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
// ENV
const apiUrl = import.meta.env.VITE_API_URL;

export default function UserDeleteAccountForm({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = function (event) {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const deleteAccount = async function (event) {
    event.preventDefault();

    const response = await fetch(`${apiUrl}/deleteMe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        password: formData.password,
      }),
    });
    if (response.ok) {
      setUser(null);
      await navigate('/');
    } else {
      const data = await response.json();
      console.log(data.message);
      setErrorMessage(data.message);
    }
  };

  return (
    <>
      <div className="my-12 flex justify-center ">
        <div className="border shadow-md border-input/70  rounded-2xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-5/12 p-4">
          <div className="mb-2">
            <Label className="text-lg">Delete Account</Label>
          </div>
          <Alert variant="destructive" className="text-left my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You will lose access to your account once your deletion request has been submitted.
            </AlertDescription>
          </Alert>
          <form className="text-left space-y-4">
            <div className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and
                      remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <form onSubmit={deleteAccount}>
                    <div className="my-2">
                      <Label htmlFor="password">Re-enter your password to confirm</Label>
                      <PasswordInput
                        id="password"
                        type="password"
                        onChange={handleChange}
                      ></PasswordInput>
                      <p className="text-red-500 text-sm font-semibold mb-2 text-left">
                        {errorMessage}
                      </p>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button type="submit" variant="destructive">
                        Delete Account
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
