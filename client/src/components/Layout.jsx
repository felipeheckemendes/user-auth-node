// Dependencies
import { Outlet } from 'react-router-dom';
// Components
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <div className="min-h-svh">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
