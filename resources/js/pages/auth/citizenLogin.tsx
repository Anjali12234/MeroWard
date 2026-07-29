import React from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function CitizenLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/citizenLogin');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-slate-200">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-sky-700 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2">
                        🏛️
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Citizen Login</h2>
                    <p className="text-xs text-slate-500 mt-1">Sign in to access services</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                            placeholder="citizen@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Password
                        </label>
                        <input 
                            type="password" 
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                            />
                            <span>Remember me</span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full bg-sky-700 hover:bg-sky-800 text-white py-2.5 rounded-md text-sm font-semibold transition duration-150 disabled:opacity-50"
                    >
                        {processing ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-600">
                        Not registered yet?{' '}
                        <Link href="/citizenRegister" className="text-sky-700 font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}