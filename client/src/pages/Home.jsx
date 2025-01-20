// UI
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <div className="flex p-32 space-x-24">
        <div className="w-6/12 space-y-4 text-left">
          <p className=" font-tinos text-5xl">
            A Token-Based <span className="whitespace-nowrap">Authentication API.</span>
          </p>
          <p className="">
            This personal side project showcases a simple yet robust user authentication system,
            built using Node.js, Express and MongoDB.
          </p>
          <p className="">Developed as part of my learning journey in full-stack development.</p>
          <p className="">Explore the API documentation below:</p>
          <Button
            className="bg-indigo-500 text-white drop-shadow-2xl shadow-lg w-56 border-slate-700"
            variant="outline"
          >
            Open API Docs
          </Button>
        </div>
        <div className="w-6/12 text-left space-y-4">
          <p className="font-tinos text-4xl">Sign up and test!</p>
          <p className="">
            Sign up and test a simple <span className="italic">React</span> front-end powered by the
            authentication API.
          </p>
          <Button
            className="bg-indigo-500 text-white drop-shadow-2xl shadow-lg w-56 border-slate-700"
            variant="outline"
          >
            Create New User Account
          </Button>
        </div>
      </div>
    </>
  );
}
