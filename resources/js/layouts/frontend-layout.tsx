import React, { ReactNode } from 'react';
import Header from '@/components/frontend/Header';
import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';

interface FrontendLayoutProps {
    children: ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-800">
            {/* Header Component */}
            <Header />

            {/* Sub-navigation Bar */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer Component */}
            <Footer />
        </div>
    );
}