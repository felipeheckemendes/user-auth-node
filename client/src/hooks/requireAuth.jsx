import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
const apiUrl = import.meta.env.VITE_API_URL;

export default function RequireAuth({ user, setUser }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      const getUser = async function () {
        const response = await fetch(`${apiUrl}/me`, {
          method: 'GET',
          credentials: 'include', // Ensure credentials are included
        });
        if (response.ok) {
          const data = await response.json();
          const user = data.data;
          setUser(user);
          setLoading(false);
        } else {
          setLoading(false);
          console.log('User not logged in');
        }
      };
      getUser();
    }
  }, []);

  const location = useLocation();
  if (!user && !loading) {
    return (
      <Navigate
        to={`/login?message=You must login first&redirectTo=${location.pathname}`}
        replace
      />
    );
  }
  return <Outlet />;
}
