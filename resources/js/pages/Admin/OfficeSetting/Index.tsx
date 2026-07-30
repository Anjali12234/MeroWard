import { useState, useEffect } from 'react'
import { Head, Form } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, Building2, FacebookIcon, Image as ImageIcon, 
  InstagramIcon, MapIcon, MapPin, MailIcon, Phone, TwitterIcon, 
  YoutubeIcon, Music2Icon, UploadCloud, Save, Navigation 
} from "lucide-react"
import { OfficeSetting } from "@/types/Admin/OfficeSetting"
import { index, store } from "@/routes/admin/office-setting"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

// Location Data Interfaces
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

interface officeSettingProps {
  officeSetting: OfficeSetting;
  locationData?: ProvinceData[];
}

// Reusable Input Field Component
const FormInputField = ({ name, label, icon: Icon, type = "text", placeholder, defaultValue, errors, className = '' }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-slate-700 flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      {label}
    </Label>
    <div className="relative group">
      <Input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${className}`}
      />
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      )}
    </div>
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1 font-medium animate-in slide-in-from-top-1">{errors[name]}</p>
    )}
  </div>
);

// Reusable Image Upload Component
const ImageUploadField = ({ name, label, desc, officeSetting, errors }: any) => {
  const imageUrl = officeSetting?.[name as keyof OfficeSetting];

  return (
    <div className="space-y-3 group">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700 block">
        {label}
      </Label>

      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-all duration-300 group-hover:shadow-sm">
        <Input
          type="file"
          name={name}
          id={name}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="p-6 flex flex-col items-center justify-center text-center">
          {imageUrl ? (
            <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden shadow-sm ring-1 ring-slate-200">
              <img
                src={String(imageUrl)}
                alt={label}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" /> Change Image
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-4 rounded-full bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700">
              {imageUrl ? 'Click to replace' : 'Click to upload image'}
            </p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </div>
      </div>

      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1 font-medium animate-in slide-in-from-top-1">{errors[name]}</p>
      )}
    </div>
  );
}

export default function OfficeSettingCreate({ officeSetting, locationData = [] }: officeSettingProps) {
  const handleCancel = () => window.history.back();

  // --- Location Selection States ---
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(
    officeSetting?.province_id ? String(officeSetting.province_id) : ''
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(
    officeSetting?.district_id ? String(officeSetting.district_id) : ''
  );
  const [selectedLocalBodyId, setSelectedLocalBodyId] = useState<string>(
    officeSetting?.local_body_id ? String(officeSetting.local_body_id) : ''
  );
  const [selectedWard, setSelectedWard] = useState<string>(
    officeSetting?.ward ? String(officeSetting.ward) : ''
  );

  // --- Cascading Options Hydration ---
  const [districts, setDistricts] = useState<District[]>(() => {
    if (officeSetting?.province_id && locationData.length > 0) {
      const foundProv = locationData.find((p) => p.id === Number(officeSetting.province_id));
      return foundProv ? foundProv.districts : [];
    }
    return [];
  });

  const [localBodies, setLocalBodies] = useState<LocalBody[]>(() => {
    if (officeSetting?.province_id && officeSetting?.district_id && locationData.length > 0) {
      const foundProv = locationData.find((p) => p.id === Number(officeSetting.province_id));
      const foundDist = foundProv?.districts.find((d) => d.id === Number(officeSetting.district_id));
      return foundDist ? foundDist.local_bodies : [];
    }
    return [];
  });

  const [availableWards, setAvailableWards] = useState<number[]>(() => {
    if (officeSetting?.province_id && officeSetting?.district_id && officeSetting?.local_body_id && locationData.length > 0) {
      const foundProv = locationData.find((p) => p.id === Number(officeSetting.province_id));
      const foundDist = foundProv?.districts.find((d) => d.id === Number(officeSetting.district_id));
      const foundLb = foundDist?.local_bodies.find((lb) => lb.id === Number(officeSetting.local_body_id));
      if (foundLb?.total_wards) {
        return Array.from({ length: foundLb.total_wards }, (_, i) => i + 1);
      }
    }
    return [];
  });

  // --- Cascading Effect Handlers ---
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
      if (foundLb?.total_wards) {
        setAvailableWards(Array.from({ length: foundLb.total_wards }, (_, i) => i + 1));
      } else {
        setAvailableWards([]);
      }
    } else {
      setAvailableWards([]);
    }
  }, [selectedLocalBodyId, localBodies]);

  return (
    <>
      <Head title="Office Settings" />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Office Settings</h1>
              <p className="text-slate-500 text-sm md:text-base">
                Manage your organization's profile, branding, and contact information.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>

          <Form
            action={store().url}
            method="post"
            className="space-y-8"
            options={{
              preserveScroll: true,
              onSuccess: () => {
                toast.success('Office Setting Updated Successfully')
              },
            }}
          >
            {({ errors }) => (
              <>
                {/* Basic Information Card */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Basic Information</CardTitle>
                        <CardDescription>Enter the core details about your office location.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInputField
                      name="office_name"
                      label="Office Name"
                      icon={Building2}
                      placeholder="e.g. Head Office"
                      defaultValue={officeSetting?.office_name}
                      errors={errors}
                    />
                    <FormInputField
                      name="office_email"
                      label="Email Address"
                      icon={MailIcon}
                      type="email"
                      placeholder="contact@company.com"
                      defaultValue={officeSetting?.office_email}
                      errors={errors}
                    />
                    <FormInputField
                      name="office_phone"
                      label="Phone Number"
                      icon={Phone}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      defaultValue={officeSetting?.office_phone}
                      errors={errors}
                    />
                    <FormInputField
                      name="office_address"
                      label="Physical Address"
                      icon={MapPin}
                      placeholder="123 Business Ave, Suite 100"
                      defaultValue={officeSetting?.office_address}
                      errors={errors}
                    />

                    <div className="md:col-span-2">
                      <FormInputField
                        name="office_google_map"
                        label="Google Maps Link"
                        icon={MapIcon}
                        type="url"
                        placeholder="https://maps.google.com/..."
                        defaultValue={officeSetting?.office_google_map}
                        errors={errors}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="desc" className="text-sm font-medium text-slate-700">Description</Label>
                      <Textarea
                        id="desc"
                        name="desc"
                        rows={4}
                        placeholder="Brief description of your office..."
                        defaultValue={officeSetting?.desc || ""}
                        className="resize-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information Card */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <Navigation className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Administrative Location</CardTitle>
                        <CardDescription>Select the administrative region and municipality/local body details.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Province Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="province_id" className="text-sm font-medium text-slate-700">Province</Label>
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
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">Select Province</option>
                        {locationData.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      {errors?.province_id && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.province_id}</p>
                      )}
                    </div>

                    {/* District Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="district_id" className="text-sm font-medium text-slate-700">District</Label>
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
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:opacity-60"
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      {errors?.district_id && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.district_id}</p>
                      )}
                    </div>

                    {/* Local Body Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="local_body_id" className="text-sm font-medium text-slate-700">Local Body</Label>
                      <select
                        id="local_body_id"
                        name="local_body_id"
                        value={selectedLocalBodyId}
                        disabled={!selectedDistrictId || localBodies.length === 0}
                        onChange={(e) => {
                          setSelectedLocalBodyId(e.target.value);
                          setSelectedWard('');
                        }}
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:opacity-60"
                      >
                        <option value="">Select Local Body</option>
                        {localBodies.map((lb) => (
                          <option key={lb.id} value={lb.id}>
                            {lb.name}
                          </option>
                        ))}
                      </select>
                      {errors?.local_body_id && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.local_body_id}</p>
                      )}
                    </div>

                    {/* Ward Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="ward" className="text-sm font-medium text-slate-700">Ward No.</Label>
                      <select
                        id="ward"
                        name="ward"
                        value={selectedWard}
                        disabled={!selectedLocalBodyId || availableWards.length === 0}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:opacity-60"
                      >
                        <option value="">Select Ward</option>
                        {availableWards.map((wardNo) => (
                          <option key={wardNo} value={wardNo}>
                            Ward {wardNo}
                          </option>
                        ))}
                      </select>
                      {errors?.ward && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.ward}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Media & Branding Card */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Media & Branding</CardTitle>
                        <CardDescription>Upload your office logos and banner images.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { name: 'office_logo', label: 'Office Logo', desc: 'Recommended: 200x200px (Square)' },
                        { name: 'office_cover', label: 'Cover Image', desc: 'Recommended: 1920x600px (Wide)' },
                      ].map((field) => (
                        <ImageUploadField
                          key={field.name}
                          {...field}
                          officeSetting={officeSetting}
                          errors={errors}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media Card */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-50 rounded-lg">
                        <UploadCloud className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Social Connections</CardTitle>
                        <CardDescription>Link your social media profiles.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: 'facebook', icon: FacebookIcon, label: 'Facebook', color: 'text-blue-600', placeholder: 'https://facebook.com/...' },
                      { name: 'twitter', icon: TwitterIcon, label: 'Twitter / X', color: 'text-sky-500', placeholder: 'https://twitter.com/...' },
                      { name: 'instagram', icon: InstagramIcon, label: 'Instagram', color: 'text-pink-600', placeholder: 'https://instagram.com/...' },
                      { name: 'youtube', icon: YoutubeIcon, label: 'YouTube', color: 'text-red-600', placeholder: 'https://youtube.com/...' },
                      { name: 'tiktok', icon: Music2Icon, label: 'TikTok', color: 'text-slate-900', placeholder: 'https://tiktok.com/...' },
                    ].map((social) => (
                      <FormInputField
                        key={social.name}
                        name={social.name}
                        label={social.label}
                        icon={social.icon}
                        type="url"
                        placeholder={social.placeholder}
                        defaultValue={officeSetting?.[social.name as keyof OfficeSetting]}
                        errors={errors}
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* Action Bar */}
                <div className="sticky bottom-4 z-10 mx-auto max-w-5xl">
                  <div className="gap-3 ml-auto">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 min-w-[120px]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  )
}

// Attach persistent layout
OfficeSettingCreate.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Office Settings", href: index().url },
      { title: "Create/Edit", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);