import React, { useState, useEffect } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';

// --- Type Definitions ---
interface LocalBody {
    id: number;
    name: string;
    total_wards: number;
}

interface District {
    id: number;
    name: string;
    local_bodies: LocalBody[];
}

interface ProvinceData {
    id: number;
    name: string;
    districts: District[];
}

interface Citizen {
    id: number;
    user_name: string;
    email: string;
    province_id: number | string;
    district_id: number | string;
    local_body_id: number | string;
    ward: number | string;
    phone_number: string;
    whatsapp_number: string;
}

interface CitizenProfileProps {
    citizen: Citizen;
    locationData: ProvinceData[];
}

export default function CitizenProfile({ citizen, locationData = [] }: CitizenProfileProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_name: citizen.user_name || '',
        email: citizen.email || '',
        province_id: citizen.province_id ? String(citizen.province_id) : '',
        district_id: citizen.district_id ? String(citizen.district_id) : '',
        local_body_id: citizen.local_body_id ? String(citizen.local_body_id) : '',
        ward: citizen.ward ? String(citizen.ward) : '',
        phone_number: citizen.phone_number || '',
        whatsapp_number: citizen.whatsapp_number || '',
        password: '',
        password_confirmation: '',
    });

    const [districts, setDistricts] = useState<District[]>([]);
    const [localBodies, setLocalBodies] = useState<LocalBody[]>([]);
    const [availableWards, setAvailableWards] = useState<number[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. Update Districts list when province_id changes or component mounts
    useEffect(() => {
        if (data.province_id) {
            const foundProv = locationData.find((p) => p.id === Number(data.province_id));
            setDistricts(foundProv ? foundProv.districts : []);
        } else {
            setDistricts([]);
        }
    }, [data.province_id, locationData]);

    // 2. Update Local Bodies list when district_id changes or component mounts
    useEffect(() => {
        if (data.district_id && districts.length > 0) {
            const foundDist = districts.find((d) => d.id === Number(data.district_id));
            setLocalBodies(foundDist ? foundDist.local_bodies : []);
        } else {
            setLocalBodies([]);
        }
    }, [data.district_id, districts]);

    // 3. Update Available Wards list when local_body_id changes or component mounts
    useEffect(() => {
        if (data.local_body_id && localBodies.length > 0) {
            const foundLb = localBodies.find((lb) => lb.id === Number(data.local_body_id));
            if (foundLb?.total_wards) {
                const wardList = Array.from({ length: foundLb.total_wards }, (_, i) => i + 1);
                setAvailableWards(wardList);
            } else {
                setAvailableWards([]);
            }
        } else {
            setAvailableWards([]);
        }
    }, [data.local_body_id, localBodies]);

    // Dynamic reset handlers on user drop-down change
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData((prev) => ({
            ...prev,
            province_id: e.target.value,
            district_id: '',
            local_body_id: '',
            ward: '',
        }));
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData((prev) => ({
            ...prev,
            district_id: e.target.value,
            local_body_id: '',
            ward: '',
        }));
    };

    const handleLocalBodyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setData((prev) => ({
            ...prev,
            local_body_id: e.target.value,
            ward: '',
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/citizenProfile');
    };

    return (
        <>
            <Head title="Citizen Profile - Dashboard" />

            <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
                {/* Mobile Header */}
                <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-2">
                        <span className="bg-sky-600 text-white p-2 rounded-lg font-bold text-sm">MW</span>
                        <span className="font-bold text-base tracking-wide">MeroWard Portal</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-slate-800 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isSidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </header>

                {/* Sidebar Navigation */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="p-6 border-b border-slate-800 hidden md:flex items-center space-x-3">
                        <div className="bg-sky-600 text-white p-2.5 rounded-xl font-extrabold text-lg shadow-sm">
                            MW
                        </div>
                        <div>
                            <h1 className="font-bold text-white text-base leading-tight">MeroWard</h1>
                            <p className="text-[11px] text-slate-400">Citizen Portal</p>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                            Menu Navigation
                        </div>
                        <nav className="mt-2 space-y-1 text-xs">
                            <Link
                                href="/"
                                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Home Page</span>
                            </Link>

                            <Link
                                href="/citizenProfile"
                                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-sky-600/20 text-sky-400 font-semibold border-l-4 border-sky-500"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Edit Profile</span>
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="bg-white border-b border-slate-200 hidden md:flex items-center justify-between px-8 py-4 shadow-sm">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Citizen Profile Management</h2>
                            <p className="text-xs text-slate-500">Update your account information and location settings</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Profile Edit Mode
                            </span>
                        </div>
                    </header>

                    <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">Account Details</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Modify your details below and click update when finished.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
                                    {/* User Name & Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.user_name}
                                                onChange={(e) => setData('user_name', e.target.value)}
                                                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${
                                                    errors.user_name ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            />
                                            {errors.user_name && <span className="text-red-500 text-[10px] mt-1 block">{errors.user_name}</span>}
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${
                                                    errors.email ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            />
                                            {errors.email && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
                                        </div>
                                    </div>

                                    {/* Location Dropdowns */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                Province <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                value={data.province_id}
                                                onChange={handleProvinceChange}
                                                className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${
                                                    errors.province_id ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            >
                                                <option value="">Select Province</option>
                                                {locationData.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            {errors.province_id && <span className="text-red-500 text-[10px] mt-1 block">{errors.province_id}</span>}
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                District <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                disabled={!data.province_id || districts.length === 0}
                                                value={data.district_id}
                                                onChange={handleDistrictChange}
                                                className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50 ${
                                                    errors.district_id ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            >
                                                <option value="">Select District</option>
                                                {districts.map((d) => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                            {errors.district_id && <span className="text-red-500 text-[10px] mt-1 block">{errors.district_id}</span>}
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                Local Body <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                disabled={!data.district_id || localBodies.length === 0}
                                                value={data.local_body_id}
                                                onChange={handleLocalBodyChange}
                                                className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50 ${
                                                    errors.local_body_id ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            >
                                                <option value="">Select Local Body</option>
                                                {localBodies.map((lb) => (
                                                    <option key={lb.id} value={lb.id}>{lb.name}</option>
                                                ))}
                                            </select>
                                            {errors.local_body_id && <span className="text-red-500 text-[10px] mt-1 block">{errors.local_body_id}</span>}
                                        </div>
                                    </div>

                                    {/* Ward, Phone & WhatsApp */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                Ward No. <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                required
                                                disabled={!data.local_body_id || availableWards.length === 0}
                                                value={data.ward}
                                                onChange={(e) => setData('ward', e.target.value)}
                                                className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50 ${
                                                    errors.ward ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            >
                                                <option value="">Select Ward</option>
                                                {availableWards.map((wardNo) => (
                                                    <option key={wardNo} value={wardNo}>
                                                        Ward {wardNo}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ward && <span className="text-red-500 text-[10px] mt-1 block">{errors.ward}</span>}
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.phone_number}
                                                onChange={(e) => setData('phone_number', e.target.value)}
                                                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${
                                                    errors.phone_number ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            />
                                            {errors.phone_number && <span className="text-red-500 text-[10px] mt-1 block">{errors.phone_number}</span>}
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-slate-700 mb-1">
                                                WhatsApp Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.whatsapp_number}
                                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${
                                                    errors.whatsapp_number ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            />
                                            {errors.whatsapp_number && <span className="text-red-500 text-[10px] mt-1 block">{errors.whatsapp_number}</span>}
                                        </div>
                                    </div>

                                    

                                    {/* Submit Actions */}
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                                        <Link
                                            href="/"
                                            className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-semibold shadow-sm transition disabled:opacity-50"
                                        >
                                            {processing ? 'Updating...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}