import userPlaceholder from '@/assets/user-placeholder.svg';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

export default function AccountOverview() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async function () {
      const result = await fetch(`${apiUrl}/me`, {
        method: 'GET',
        credentials: 'include', // Ensure credentials are included
      });
      const data = await result.json();
      const user = data.data;
      return user;
    };
    getUser().then((user) => setUser(user));
  }, []);

  return (
    <div className="mt-12 flex">
      <div className="w-3/12"></div>
      <div className="relative pl-8 pt-4">
        <img
          className="w-36 rounded-full border-2 mr-12 absolute top-0 left-0 transform -translate-x-full"
          src={userPlaceholder && userPlaceholder}
        />
        <h2 className="text-5xl font-light text-slate-800 mb-12">
          Welcome{user?.information?.firstName && ', ' + user?.information?.firstName}
          {user?.information?.lastName && ' ' + user?.information?.lastName}!
        </h2>
        <div className="text-slate-700 text-left mb-6">
          <ul className="space-y-3">
            <li className="text-left pb-3">
              <b>Account information</b>
            </li>
            {user?.email && (
              <li>
                <b>Email:</b> {user.email}
              </li>
            )}
            {user?.cellphone && (
              <li>
                <b>Cellphone:</b> {user.cellphone}
              </li>
            )}
            {user?.createdAt && (
              <li>
                <b>Account created on:</b>{' '}
                {Intl.DateTimeFormat(navigator.language).format(new Date(user.createdAt))}
              </li>
            )}
          </ul>
        </div>
        <div className="text-left">
          <Link to="update">
            <Button variant="mainIndigo">Update Account Information</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
