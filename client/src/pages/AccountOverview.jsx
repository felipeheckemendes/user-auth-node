import userPlaceholder from '@/assets/user-placeholder.svg';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

const user = {
  email: 'john@email.com',
  cellphone: '123456789',
  createdAt: '2025-01-01',
  info: {
    firstName: 'John',
    lastName: 'Doe',
    photoUrl: userPlaceholder,
  },
};

export default function AccountOverview() {
  return (
    <div className="mt-12 flex">
      <div className="w-3/12"></div>
      <div className="relative pl-16 pt-4">
        <img
          className="w-36 rounded-full border-2 mr-12 absolute top-0 left-0 transform -translate-x-full"
          src={userPlaceholder && userPlaceholder}
        />
        <h2 className="text-5xl font-light text-slate-800 mb-12">
          Welcome{user?.info?.firstName && ', ' + user?.info?.firstName}{' '}
          {user?.info?.lastName && ' ' + user?.info?.lastName}!
        </h2>
        <p className="text-slate-700 text-left mb-6">
          <ul className="space-y-3">
            <li className="text-center pb-3">
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
                <b>Account created on:</b> {user.createdAt}
              </li>
            )}
          </ul>
        </p>
        <div className="text-left">
          <Link to="update">
            <Button variant="mainIndigo">Update Account Information</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
