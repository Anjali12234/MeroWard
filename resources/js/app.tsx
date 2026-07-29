import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import FrontendLayout from '@/layouts/frontend-layout'; // 1. Import your Layout

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        // Normalize name to lowercase just in case (e.g. 'Welcome' vs 'welcome')
        const pageName = name.toLowerCase();

        switch (true) {
            // 2. Map welcome and public pages to FrontendLayout
            case pageName === 'welcome':
            case pageName.startsWith('frontend/'):
            case pageName === 'register':
                return FrontendLayout;

            case pageName.startsWith('auth/'):
                return AuthLayout;
            case pageName.startsWith('settings/'):
            case pageName.startsWith('teams/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();