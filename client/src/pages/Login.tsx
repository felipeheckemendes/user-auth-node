import LoginForm from '@/components/LoginForm';

export default function Page({ setUser }: { setUser: any }) {
  return (
    <div className="flex max-h-[calc(100svh-200px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm setUser={setUser} />
      </div>
    </div>
  );
}
