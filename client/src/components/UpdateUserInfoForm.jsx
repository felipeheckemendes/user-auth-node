import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import userPlaceholder from '@/assets/user-placeholder.svg';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

export default function UpdateUserInfoForm({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: user?.information?.firstName || '',
    lastName: user?.information?.lastName || '',
    cellphone: user?.cellphone || '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData({
      firstName: user?.information?.firstName || '',
      lastName: user?.information?.lastName || '',
      cellphone: user?.cellphone || '',
    });
  }, [user]);

  const handleChange = function (event) {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const updateUserInfo = async function (event) {
    event.preventDefault();
    const response = await fetch(`${apiUrl}/updateMe`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        information: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        cellphone: formData.cellphone,
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
            <Label className="text-lg text-left">Profile</Label>
          </div>

          <div className="m-6 text-left flex items-end">
            <img
              className="w-24  rounded-full border-2 mr-8"
              src={user?.information?.imageUrl || userPlaceholder}
            />
            <Button variant="outline" className="text-xs bg-transparent mb-2">
              Change profile picture
            </Button>
          </div>

          <Separator />

          <form onSubmit={updateUserInfo} className="text-left space-y-4">
            <div className=" space-x-4 flex">
              <div className="flex-1 space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={handleChange}></Input>
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="cellphone">Cellphone Number</Label>
              <Input id="cellphone" value={formData.cellphone} onChange={handleChange} />
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
