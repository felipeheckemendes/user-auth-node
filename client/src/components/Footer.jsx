import { Separator } from '@/components/ui/separator';
// Icons
import github from '@/assets/github.svg';
import linkedin from '@/assets/linkedin.svg';

export default function Footer() {
  return (
    <>
      <div className="bg-gray-900 text-blue-200 h-48 flex items-center justify-center space-x-16">
        <div>
          <p className="text-lg">Developed by Felipe Hecke</p>
          <p></p>
        </div>
        <div>
          <p className="font-bold">Built with Node.js, Express, MongoDB, and React</p>
          <Separator className="my-3" />
          <p className="text-sm">This is a demo project not intended for production use.</p>
        </div>
        <div className="text-left space-y-2">
          <h2 className="font-bold">Links</h2>
          <p className="text-sm">
            <img src={github} className="inline mr-2" />
            Check the project&apos;s{' '}
            <a href="" className="font-bold underline">
              Github
            </a>{' '}
            respository
          </p>
          <p className="text-sm">
            <img src={linkedin} className="inline mr-2" />
            Visit my{' '}
            <a href="" className="font-bold underline">
              LinkedIn profile
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
