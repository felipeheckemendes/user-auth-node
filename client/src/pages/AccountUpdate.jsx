import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PasswordInput from '@/components/PasswordInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import userPlaceholder from '@/assets/user-placeholder.svg';

const user = {
  email: 'john@email.com',
  cellphone: '123456789',
  createdAt: '2025-01-01',
  info: {
    firstName: 'John',
    lastName: 'Doe',
  },
};

export default function AccountUpdate() {
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
              src={user.info.imageUrl || userPlaceholder}
            />
            <Button variant="outline" className="text-xs bg-transparent mb-2">
              Change profile picture
            </Button>
          </div>

          <Separator />

          <form className="text-left space-y-4">
            <div className=" space-x-4 flex">
              <div className="flex-1 space-y-1">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" value={user.info.firstName || ''}></Input>
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" value={user.info.lastName || ''} />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <Label htmlFor="lastname">Cellphone Number</Label>
              <Input id="lastname" value={user.info.cellphone || ''} />
            </div>

            <div className="text-right">
              <Button variant="mainIndigo">Save changes</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="my-12 flex justify-center ">
        <div className="border shadow-md border-input/70 rounded-2xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-5/12 p-4">
          <div className="mb-2">
            <Label className="text-lg">Update Email Address</Label>
          </div>
          <form className="text-left space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Current Email Address</Label>
              <Input id="email" value={user.email} disabled></Input>
            </div>
            <div className="space-y-1">
              <Label htmlFor="newemail">New Email Address</Label>
              <Input id="newemail"></Input>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Enter your password</Label>
              <PasswordInput id="password"></PasswordInput>
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
              <Button variant="mainIndigo">Save changes</Button>
            </div>
          </form>
        </div>
      </div>

      <div className="my-12 flex justify-center ">
        <div className="border shadow-md border-input/70  rounded-2xl w-11/12 sm:w-10/12 md:w-8/12 lg:w-7/12 xl:w-5/12 p-4">
          <div className="mb-2">
            <Label className="text-lg">Password</Label>
          </div>
          <form className="text-left space-y-4">
            <div className="space-y-1">
              <Label htmlFor="currentpassword">Current Password</Label>
              <PasswordInput id="currentpassword" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newpassword">New Password</Label>
              <PasswordInput id="newpassword" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newpasswordconfirm">Confirm New Password</Label>
              <div className="relative">
                <PasswordInput id="newpasswordconfirm"></PasswordInput>
              </div>
            </div>

            <div className="text-right">
              <Button variant="mainIndigo">Save changes</Button>
            </div>
          </form>
        </div>
      </div>
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
              <Button variant="destructive">Delete Account</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
