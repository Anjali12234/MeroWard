import { Link, usePage } from '@inertiajs/react';
import { 
  LayoutGrid, 
  Building2, 
  Users, 
  UserCheck, 
  Briefcase, 
  Bell, 
  Calendar, 
  FolderKanban 
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/admin';
import type { NavItem } from '@/types';
import { index } from '@/routes/admin/office-setting';
import citizen from '@/routes/admin/citizen';
import employee from '@/routes/admin/employee';
import service from '@/routes/admin/service';
import notice from '@/routes/admin/notice';
import event from '@/routes/admin/event';
import project from '@/routes/admin/project';

export function AppSidebar() {
    const page = usePage();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: "Office Settings",
            href: index(),
            icon: Building2
        },
        {
            title: "Citizen",
            href: citizen.index(),
            icon: Users
        },
        {
            title: "Employee",
            href: employee.index(),
            icon: UserCheck
        },
        {
            title: "Services",
            href: service.index(),
            icon: Briefcase
        },
        {
            title: "Notice",
            href: notice.index(),
            icon: Bell
        },
        {
            title: "Event",
            href: event.index(),
            icon: Calendar
        },
        {
            title: "Project",
            href: project.index(),
            icon: FolderKanban
        },
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}