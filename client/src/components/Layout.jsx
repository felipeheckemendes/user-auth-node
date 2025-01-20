// Dependencies
import { Outlet } from 'react-router-dom';
// Components
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <div className="min-h-svh flex justify-center bg-slate-50 ">
        <div className="min-h-svh flex justify-center w-full lg:w-10/12 xl:w-9/12 3xl:w-7/12">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
