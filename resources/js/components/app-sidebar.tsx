import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2Icon, FolderGit2, LayoutGrid, User } from 'lucide-react';
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
            icon: Building2Icon
        },
        {
            title: "Citizen",
            href: citizen.index(),
            icon: User
        },
        {
            title: "Employee",
            href: employee.index(),
            icon: User
        },
        {
            title: "Services",
            href: service.index(),
            icon: BookOpen
        },
        {
            title: "Notice",
            href: notice.index(),
            icon: BookOpen
        },
    ];

    const footerNavItems: NavItem[] = [

    ];

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
