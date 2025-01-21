import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function PasswordInput(props) {
  const [visibility, setVisibility] = useState(false);

  function handleEyeClick() {
    setVisibility(!visibility);
  }

  return (
    <>
      <div className="relative">
        {visibility ? (
          <Eye
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 text-gray-500"
            onClick={handleEyeClick}
          />
        ) : (
          <EyeOff
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 text-gray-500"
            onClick={handleEyeClick}
          />
        )}
        <Input {...props} type={visibility ? 'text' : 'password'} className="pr-12" />
      </div>
    </>
  );
}
