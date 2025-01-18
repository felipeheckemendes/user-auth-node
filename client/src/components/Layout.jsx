// Dependencies
import { Outlet } from 'react-router-dom';
// Components
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <div className="bg-blue-200 min-h-svh">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
