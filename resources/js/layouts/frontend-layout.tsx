import React from 'react';
import Footer from '@/components/frontend/Footer';
import Header from '@/components/frontend/Header';
import Navbar from '@/components/frontend/Navbar';

interface FrontendLayoutProps {
    children: React.ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col justify-between">
            <div>
                <Header />
                <Navbar />
                <main>{children}</main>
            </div>
            <Footer />
        </div>
    );
}