import logo from '@/assets/logo.svg';

export default function Header() {
  return (
    <>
      <div className="h-24 flex justify-center bg-blue-100">
        <img src={logo} className="max-h-full" />
      </div>
    </>
  );
}
