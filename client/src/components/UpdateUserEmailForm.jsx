// REACT
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
// UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/PasswordInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
// ENV
const apiUrl = import.meta.env.VITE_API_URL;

export default function UpdateUserEmailForm({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentEmail: user?.email || '',
    newEmail: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData((currentData) => {
      return {
        ...currentData,
        currentEmail: user?.email || '',
      };
    });
  }, [user]);

  const handleChange = function (event) {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const updateUserEmail = async function (event) {
    event.preventDefault();

    const response = await fetch(`${apiUrl}/updateMyEmail`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: formData.newEmail,
        password: formData.password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      await navigate('/account/profile');
    } else {
      const data = await response.json();
      console.log(data.message);
      setErrorMessage(data.message);
    }
  };

  return (
    <>
      <div className="my-12 flex justify-center ">
        <div className="border shadow-md border-input/70 rounded-2xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-5/12 p-4">
          <div className="mb-2">
            <Label className="text-lg">Update Email Address</Label>
          </div>
          <form className="text-left space-y-4" onSubmit={updateUserEmail}>
            <div className="space-y-1">
              <Label htmlFor="email">Current Email Address</Label>
              <Input id="email" value={formData.currentEmail} disabled></Input>
            </div>
            <div className="space-y-1">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input id="newEmail" value={formData.newEmail} onChange={handleChange}></Input>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Enter your password</Label>
              <PasswordInput
                id="password"
                value={formData.password}
                onChange={handleChange}
              ></PasswordInput>
            </div>
            <Alert variant="info" className="text-left my-2">
              <AlertCircle color="#3b82f6" className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                Once you save changes, you will need to use your new email address to log into your
                account.
              </AlertDescription>
            </Alert>
            <div className="text-right">
              <p className="text-red-500 text-sm font-semibold mb-2 text-left">{errorMessage}</p>
              <Button variant="mainIndigo">Save changes</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
