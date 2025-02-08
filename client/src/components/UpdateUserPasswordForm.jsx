// REACT
import { useNavigate } from 'react-router';
import { useState } from 'react';
// UI
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/PasswordInput';
// ENV
const apiUrl = import.meta.env.VITE_API_URL;

export default function UpdateUserPasswordForm({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = function (event) {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const updateUserPassword = async function (event) {
    event.preventDefault();

    const response = await fetch(`${apiUrl}/updatePassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        newPasswordConfirm: formData.newPasswordConfirm,
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
        <div className="border shadow-md border-input/70  rounded-2xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-5/12 p-4">
          <div className="mb-2">
            <Label className="text-lg">Password</Label>
          </div>
          <form className="text-left space-y-4" onSubmit={updateUserPassword}>
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput id="currentPassword" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput id="newPassword" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newPasswordConfirm">Confirm New Password</Label>
              <div className="relative">
                <PasswordInput id="newPasswordConfirm" onChange={handleChange}></PasswordInput>
              </div>
            </div>

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
