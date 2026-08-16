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

interface CitizenRegisterProps {
    locationData: ProvinceData[];
}

export default function CitizenRegister({ locationData = [] }: CitizenRegisterProps) {
    const { data, setData, post, processing, errors } = useForm({
        user_name: '',
        email: '',
        province_id: '',
        district_id: '',
        local_body_id: '',
        ward: '',
        phone_number: '',
        whatsapp_number: '',
        password: '',
        password_confirmation: '',
    });

    const [districts, setDistricts] = useState<District[]>([]);
    const [localBodies, setLocalBodies] = useState<LocalBody[]>([]);
    const [availableWards, setAvailableWards] = useState<number[]>([]);

    // 1. Update Districts when Province changes
    useEffect(() => {
        if (data.province_id) {
            const foundProv = locationData.find((p) => p.id === Number(data.province_id));
            setDistricts(foundProv ? foundProv.districts : []);
        } else {
            setDistricts([]);
        }
    }, [data.province_id, locationData]);

    // 2. Update Local Bodies when District changes
    useEffect(() => {
        if (data.district_id) {
            const foundDist = districts.find((d) => d.id === Number(data.district_id));
            setLocalBodies(foundDist ? foundDist.local_bodies : []);
        } else {
            setLocalBodies([]);
        }
    }, [data.district_id, districts]);

    // 3. Update Ward List when Local Body changes
    useEffect(() => {
        if (data.local_body_id) {
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

    // Handlers for cascading dropdown resets
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
        post('/citizenRegisterStore');
    };

    return (
        <>
            <Head title="Citizen Registration" />

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-bold text-slate-800">Citizen Registration</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Create your account to access digital municipal services.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">

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
                                    placeholder="Enter full name"
                                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${errors.user_name ? 'border-red-500' : 'border-slate-300'
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
                                    placeholder="example@domain.com"
                                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${errors.email ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                />
                                {errors.email && <span className="text-red-500 text-[10px] mt-1 block">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Location Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Province */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Province <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.province_id}
                                    onChange={handleProvinceChange}
                                    className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${errors.province_id ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                >
                                    <option value="">Select Province</option>
                                    {locationData.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                {errors.province_id && <span className="text-red-500 text-[10px] mt-1 block">{errors.province_id}</span>}
                            </div>

                            {/* District */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    District <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    disabled={!data.province_id || districts.length === 0}
                                    value={data.district_id}
                                    onChange={handleDistrictChange}
                                    className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50 ${errors.district_id ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                >
                                    <option value="">Select District</option>
                                    {districts.map((d) => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                                {errors.district_id && <span className="text-red-500 text-[10px] mt-1 block">{errors.district_id}</span>}
                            </div>

                            {/* Local Body */}
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Local Body <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    disabled={!data.district_id || localBodies.length === 0}
                                    value={data.local_body_id}
                                    onChange={handleLocalBodyChange}
                                    className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50 ${errors.local_body_id ? 'border-red-500' : 'border-slate-300'
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
                                    className={`w-full p-2.5 rounded-xl border bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition disabled:opacity-50 ${errors.ward ? 'border-red-500' : 'border-slate-300'
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
                                    placeholder="98XXXXXXXX"
                                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${errors.phone_number ? 'border-red-500' : 'border-slate-300'
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
                                    placeholder="98XXXXXXXX"
                                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${errors.whatsapp_number ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                />
                                {errors.whatsapp_number && <span className="text-red-500 text-[10px] mt-1 block">{errors.whatsapp_number}</span>}
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Min 8 chars, mixed case, number & symbol"
                                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-sky-500 focus:outline-none transition ${errors.password ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                />
                                {errors.password && <span className="text-red-500 text-[10px] mt-1 block">{errors.password}</span>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Repeat password"
                                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-6 flex items-center justify-end space-x-3">
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
                                {processing ? 'Registering...' : 'Register'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
