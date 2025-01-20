import { NavLink, Outlet } from 'react-router';
// UI
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export default function AccountLayout() {
  const items = [
    {
      title: 'Profile',
      url: '',
    },
    {
      title: 'Update Info',
      url: 'update',
    },
    {
      title: 'Delete Account',
      url: 'deleteme',
    },
  ];

  return (
    <>
      <div className="w-4/12 lg:w-2/12 pt-4 border bg-indigo-50">
        <SidebarProvider>
          <Sidebar collapsible="none">
            <SidebarContent>
              <SidebarHeader className="font-bold text-xl text-indigo-700">Account</SidebarHeader>
              <SidebarGroup className="pl-2">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          className="border-l-4 border-transparent hover:border-l-indigo-400 hover:bg-transparent"
                        >
                          <NavLink to={item.url}>
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </>
  );
}
