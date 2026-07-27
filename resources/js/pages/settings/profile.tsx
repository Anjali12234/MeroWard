import { useState, useEffect } from 'react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

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

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
    roles: Array<{ value: string; label: string }>;
    locationData: ProvinceData[];
}

export default function Profile({
    mustVerifyEmail,
    status,
    roles = [],
    locationData = [],
}: ProfileProps) {
    const { auth } = usePage().props as any;

    // 1. Dropdown selection states using IDs
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
        auth.user.province_id ? String(auth.user.province_id) : ''
    );
    const [selectedDistrictId, setSelectedDistrictId] = useState<string>(
        auth.user.district_id ? String(auth.user.district_id) : ''
    );
    const [selectedLocalBodyId, setSelectedLocalBodyId] = useState<string>(
        auth.user.local_body_id ? String(auth.user.local_body_id) : ''
    );
    const [selectedWard, setSelectedWard] = useState<string>(
        auth.user.ward ? String(auth.user.ward) : ''
    );

    // 2. Initial state hydration for pre-filled user location
    const [districts, setDistricts] = useState<District[]>(() => {
        if (auth.user.province_id && locationData.length > 0) {
            const foundProv = locationData.find((p) => p.id === Number(auth.user.province_id));
            return foundProv ? foundProv.districts : [];
        }
        return [];
    });

    const [localBodies, setLocalBodies] = useState<LocalBody[]>(() => {
        if (auth.user.province_id && auth.user.district_id && locationData.length > 0) {
            const foundProv = locationData.find((p) => p.id === Number(auth.user.province_id));
            const foundDist = foundProv?.districts.find((d) => d.id === Number(auth.user.district_id));
            return foundDist ? foundDist.local_bodies : [];
        }
        return [];
    });

    const [availableWards, setAvailableWards] = useState<number[]>(() => {
        if (auth.user.province_id && auth.user.district_id && auth.user.local_body_id && locationData.length > 0) {
            const foundProv = locationData.find((p) => p.id === Number(auth.user.province_id));
            const foundDist = foundProv?.districts.find((d) => d.id === Number(auth.user.district_id));
            const foundLb = foundDist?.local_bodies.find((lb) => lb.id === Number(auth.user.local_body_id));
            if (foundLb?.total_wards) {
                return Array.from({ length: foundLb.total_wards }, (_, i) => i + 1);
            }
        }
        return [];
    });

    // 3. Cascading update listeners
    useEffect(() => {
        if (selectedProvinceId) {
            const foundProv = locationData.find((p) => p.id === Number(selectedProvinceId));
            setDistricts(foundProv ? foundProv.districts : []);
        } else {
            setDistricts([]);
        }
    }, [selectedProvinceId, locationData]);

    useEffect(() => {
        if (selectedDistrictId) {
            const foundDist = districts.find((d) => d.id === Number(selectedDistrictId));
            setLocalBodies(foundDist ? foundDist.local_bodies : []);
        } else {
            setLocalBodies([]);
        }
    }, [selectedDistrictId, districts]);

    useEffect(() => {
        if (selectedLocalBodyId) {
            const foundLb = localBodies.find((lb) => lb.id === Number(selectedLocalBodyId));
            if (foundLb && foundLb.total_wards) {
                const wardList = Array.from({ length: foundLb.total_wards }, (_, i) => i + 1);
                setAvailableWards(wardList);
            } else {
                setAvailableWards([]);
            }
        } else {
            setAvailableWards([]);
        }
    }, [selectedLocalBodyId, localBodies]);

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Update your name, role, and location"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Name Input */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            {/* Email Input */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Email address"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {/* Role Dropdown */}
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    defaultValue={auth.user.role}
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.role} />
                            </div>

                            <hr className="my-4 border-border" />

                            {/* LOCATION DROPDOWNS (WITH CORRECT KEY NAMES & IDS) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* 1. Province */}
                                <div className="grid gap-2">
                                    <Label htmlFor="province_id">Province</Label>
                                    <select
                                        id="province_id"
                                        name="province_id"
                                        value={selectedProvinceId}
                                        onChange={(e) => {
                                            setSelectedProvinceId(e.target.value);
                                            setSelectedDistrictId('');
                                            setSelectedLocalBodyId('');
                                            setSelectedWard('');
                                        }}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                                    >
                                        <option value="">Select Province</option>
                                        {locationData.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.province_id} />
                                </div>

                                {/* 2. District */}
                                <div className="grid gap-2">
                                    <Label htmlFor="district_id">District</Label>
                                    <select
                                        id="district_id"
                                        name="district_id"
                                        value={selectedDistrictId}
                                        disabled={!selectedProvinceId || districts.length === 0}
                                        onChange={(e) => {
                                            setSelectedDistrictId(e.target.value);
                                            setSelectedLocalBodyId('');
                                            setSelectedWard('');
                                        }}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm disabled:opacity-50"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.district_id} />
                                </div>

                                {/* 3. Local Body */}
                                <div className="grid gap-2">
                                    <Label htmlFor="local_body_id">Local Body</Label>
                                    <select
                                        id="local_body_id"
                                        name="local_body_id"
                                        value={selectedLocalBodyId}
                                        disabled={!selectedDistrictId || localBodies.length === 0}
                                        onChange={(e) => {
                                            setSelectedLocalBodyId(e.target.value);
                                            setSelectedWard('');
                                        }}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm disabled:opacity-50"
                                    >
                                        <option value="">Select Local Body</option>
                                        {localBodies.map((lb) => (
                                            <option key={lb.id} value={lb.id}>
                                                {lb.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.local_body_id} />
                                </div>

                                {/* 4. Ward Number */}
                                <div className="grid gap-2">
                                    <Label htmlFor="ward">Ward No.</Label>
                                    <select
                                        id="ward"
                                        name="ward"
                                        value={selectedWard}
                                        disabled={!selectedLocalBodyId || availableWards.length === 0}
                                        onChange={(e) => setSelectedWard(e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm disabled:opacity-50"
                                    >
                                        <option value="">Select Ward</option>
                                        {availableWards.map((wardNo) => (
                                            <option key={wardNo} value={wardNo}>
                                                Ward {wardNo}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError className="mt-2" message={errors.ward} />
                                </div>
                            </div>

                            {/* Email Verification Link */}
                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex items-center gap-4">
                                <Button disabled={processing} data-test="update-profile-button">
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};