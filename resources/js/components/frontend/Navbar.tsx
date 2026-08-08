import React from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <nav className="bg-slate-800 text-white text-xs font-medium border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 h-10 overflow-x-auto">
                <Link href="/" className="hover:text-sky-300 transition whitespace-nowrap">Home</Link>
                <Link href="/service" className="hover:text-sky-300 transition whitespace-nowrap">Services</Link>
                <Link href="/notice" className="hover:text-sky-300 transition whitespace-nowrap">Notices</Link>
                <Link href="/projects" className="hover:text-sky-300 transition whitespace-nowrap">Projects</Link>
                <Link href="/archives" className="hover:text-sky-300 transition whitespace-nowrap">Public Archives</Link>
                <Link href="/contact" className="hover:text-sky-300 transition whitespace-nowrap">Contact</Link>
            </div>
        </nav>
    );
}