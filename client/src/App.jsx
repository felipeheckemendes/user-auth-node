// Dependencies
import { createRoutesFromElements, createBrowserRouter, Route, RouterProvider } from 'react-router';
// CSS
import './App.css';
// Components
import Layout from './components/Layout';
import AccountLayout from './components/AccountLayout';
// Pages
import Home from './pages/Home';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.tsx';
import Logout from './pages/Logout.jsx';
import Signup from './pages/Signup.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import AccountOverview from './pages/AccountOverview';
import AccountUpdate from './pages/AccountUpdate';
import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async function () {
      const response = await fetch(`${apiUrl}/me`, {
        method: 'GET',
        credentials: 'include', // Ensure credentials are included
      });
      if (response.ok) {
        const data = await response.json();
        const user = data.data;
        return user;
      } else {
        console.log('User not logged in');
        return null;
      }
    };
    getUser().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout user={user} setUser={setUser} />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact setUser={setUser} />} />
        <Route path="login" element={<Login setUser={setUser} />} />
        <Route path="logout" element={<Logout user={user} setUser={setUser} />} />
        <Route path="signup" element={<Signup setUser={setUser} />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="account">
          <Route path="profile" element={<AccountLayout />}>
            <Route index element={<AccountOverview user={user} />} />
            <Route path="update" element={<AccountUpdate user={user} setUser={setUser} />} />
          </Route>
        </Route>
      </Route>,
    ),
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
