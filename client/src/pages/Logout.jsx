import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Logout({ user, setUser }) {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const logout = async function () {
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        navigate('/');
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
        console.log(data.message);
      }
    };
    logout();
  }, []);

  return (
    <div className="flex max-h-[calc(100svh-200px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        <p>Logging Out</p>
        <p className="text-red-500 text-sm font-semibold mb-2 text-center">{errorMessage}</p>
      </div>
    </div>
  );
}
