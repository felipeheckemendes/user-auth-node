// Libraries
import { Link, NavLink } from 'react-router';
// Assets
import logo from '@/assets/logo.svg';
import avatarIcon from '@/assets/avatar.svg';
import accountIcon from '@/assets/account.svg';
import logoutIcon from '@/assets/logout.svg';
// UI
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';

export default function Header() {
  return (
    <>
      <div className="h-10 flex justify-center items-center bg-blue-950 text-white py-10 px-0 md:px-8">
        <div className="h-10 w-full lg:w-10/12 xl:w-9/12 3xl:w-7/12 flex justify-between">
          <Link className="flex items-center flex-1">
            <img src={logo} className="max-h-10 mr-2" />
            <p className="font-sans text-xl font-bold pr-4">MyNodeAuth</p>
          </Link>
          <NavigationMenu className="relative">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink
                  to="contact"
                  className={
                    navigationMenuTriggerStyle() +
                    ' bg-indigo-400 text-white border-slate-100 border-2'
                  }
                >
                  Contact Me
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink to="about" className={navigationMenuTriggerStyle()}>
                  About
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink to="login" className={navigationMenuTriggerStyle()}>
                  API Docs
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="login"
                  className={navigationMenuTriggerStyle() + ' border-2 border-blue-200'}
                >
                  Login
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu className="ml-1">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  John Smith <img src={avatarIcon} className="pl-2 max-h-5" />{' '}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="px-4 py-2 min-w-48 text-left">
                    <li>
                      <img src={accountIcon} className="inline mr-2 w-5" />
                      <NavLink to="account"> Manage account</NavLink>
                    </li>
                    <Separator className="my-2" />
                    <li>
                      <img src={logoutIcon} className="inline mr-2" />
                      <NavLink to="logout">Logout</NavLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </>
  );
}
