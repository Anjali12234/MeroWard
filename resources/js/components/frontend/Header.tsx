import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { citizenLoginPage } from '@/routes';

// TypeScript interfaces
interface Citizen {
    id: number;
    user_name: string;
    email?: string;
}

interface OfficeSetting {
    name: string;
}

interface SharedProps extends PageProps {
    officeSetting?: OfficeSetting | null;
    auth?: {
        user?: any;
        citizen?: Citizen | null;
    };
}

export default function Header() {
    const [language, setLanguage] = useState<string>('English');

    // Retrieve shared props
    const { auth, officeSetting } = usePage<SharedProps>().props;
    const citizen = auth?.citizen;

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Brand Logo & Dynamic Office Name */}
                <Link href="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        🏛️
                    </div>
                    {/* Dynamic Office Name with fallback */}
                    <span className="text-2xl font-bold text-sky-800 tracking-tight">
                        {officeSetting?.name || 'MeroWard'}
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center space-x-4">

                    {citizen ? (
                        /* --- LOGGED IN STATE --- */
                        <>
                            <Link
                                href="/citizen/profile"
                                className="flex items-center space-x-2 border-l border-r px-4 border-slate-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${citizen.user_name}`}
                                        alt="Profile Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                                    {citizen.user_name}
                                </span>
                            </Link>

                            {/* Logout Button (Sends a POST request) */}
                            <Link
                                href="/citizenLogout"
                                method="post"
                                as="button"
                                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-semibold transition"
                            >
                                Logout
                            </Link>
                        </>
                    ) : (
                        /* --- LOGGED OUT STATE --- */
                        <>
                            <Link
                                href={citizenLoginPage().url}
                                className="text-xs bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md font-semibold transition"
                            >
                                Citizen Login
                            </Link>

                            <Link
                                href="/citizenRegister"
                                className="flex items-center space-x-2 border-l border-r px-4 border-slate-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`}
                                        alt="Profile Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                                    Profile
                                </span>
                            </Link>
                        </>
                    )}

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs bg-sky-800 text-white px-3 py-1.5 rounded-md font-medium outline-none cursor-pointer"
                    >
                        <option value="English">English</option>
                        <option value="Nepali">नेपाली</option>
                    </select>
                </div>
            </div>
        </header>
    );
}
