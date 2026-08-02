import { useState } from 'react'
import { Head, Form } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building2, Image as ImageIcon, 
  MailIcon, Phone, UploadCloud, Save, 
  UserIcon,
  NotebookIcon,
  BuildingIcon,
  TimerIcon,
  UserCheckIcon,
  ArrowLeft
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { Employee } from '@/types/Admin/Employee'
import { index, store, update } from '@/routes/admin/employee' // Ensure update route is imported

interface EmployeeFormProps {
  employee?: Employee;
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

// Reusable Select Dropdown Field Component
const FormSelectField = ({ name, label, icon: Icon, defaultValue, options, errors }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-slate-700 flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      {label}
    </Label>
    <div className="relative group">
      <select
        id={name}
        name={name}
        defaultValue={defaultValue !== undefined && defaultValue !== null ? String(Number(defaultValue)) : "1"}
        className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
      >
        {options.map((option: { label: string; value: string | number }) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
      )}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        ▼
      </div>
    </div>
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1 font-medium animate-in slide-in-from-top-1">{errors[name]}</p>
    )}
  </div>
);

// Reusable Image Upload Component with Live Local Preview
const ImageUploadField = ({ name, label, desc, employee, errors }: any) => {
  const initialUrl = employee?.[name as keyof Employee] ? String(employee[name as keyof Employee]) : null;
  const [preview, setPreview] = useState<string | null>(initialUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

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
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="p-6 flex flex-col items-center justify-center text-center">
          {preview ? (
            <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden shadow-sm ring-1 ring-slate-200">
              <img
                src={preview}
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
              {preview ? 'Click to replace image' : 'Click to upload image'}
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
};

export default function EmployeeForm({ employee }: EmployeeFormProps) {
  const isEditing = Boolean(employee?.id);
  const handleCancel = () => window.history.back();

  // Dynamic route target
  const targetUrl = isEditing && employee ? update({ employee: employee.id }).url : store().url;

  return (
    <>
      <Head title={isEditing ? "Edit Employee" : "Create Employee"} />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {isEditing ? "Edit Employee" : "Create Employee"}
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                {isEditing
                  ? "Update employee personal details, image, and organizational position."
                  : "Add a new employee to your organization system."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>

          <Form
            action={targetUrl}
            method="post"
            className="space-y-8"
            options={{
              preserveScroll: true,
              onSuccess: () => {
                toast.success(isEditing ? 'Employee Updated Successfully' : 'Employee Saved Successfully');
              },
            }}
          >
            {({ errors }) => (
              <>
                {/* Method Spoofing for Laravel Multipart Updates */}
                {isEditing && <input type="hidden" name="_method" value="PUT" />}

                {/* Basic Information Card */}
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">
                          {isEditing ? "Update Information" : "Basic Information"}
                        </CardTitle>
                        <CardDescription>
                          {isEditing ? "Modify existing details for this record." : "Enter core details for the new employee."}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadField
                      name="image"
                      label="Profile Image"
                      desc="PNG, JPG or JPEG up to 2MB"
                      employee={employee}
                      errors={errors}
                    />
                    <FormInputField
                      name="name"
                      label="Employee Name"
                      icon={UserIcon}
                      placeholder="e.g. Ram Bahadur Sapkota"
                      defaultValue={employee?.name}
                      errors={errors}
                    />
                    <FormInputField
                      name="email"
                      label="Email Address"
                      icon={MailIcon}
                      type="email"
                      placeholder="contact@company.com"
                      defaultValue={employee?.email}
                      errors={errors}
                    />
                    <FormInputField
                      name="phone"
                      label="Phone Number"
                      icon={Phone}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      defaultValue={employee?.phone}
                      errors={errors}
                    />
                    <FormInputField
                      name="designation"
                      label="Designation"
                      icon={NotebookIcon}
                      type="text"
                      placeholder="CEO"
                      defaultValue={employee?.designation}
                      errors={errors}
                    />
                    <FormInputField
                      name="section"
                      label="Section"
                      icon={BuildingIcon}
                      type="text"
                      placeholder="City Police"
                      defaultValue={employee?.section}
                      errors={errors}
                    />
                    <FormInputField
                      name="position"
                      label="Position"
                      icon={TimerIcon}
                      type="number"
                      placeholder="1"
                      defaultValue={employee?.position}
                      errors={errors}
                    />

                    <FormSelectField
                      name="is_employee"
                      label="Is Employee"
                      icon={UserCheckIcon}
                      defaultValue={employee?.is_employee}
                      options={[
                        { label: 'Yes', value: 1 },
                        { label: 'No', value: 0 },
                      ]}
                      errors={errors}
                    />
                  </CardContent>
                </Card>

                {/* Action Bar */}
                <div className="sticky bottom-4 z-10 mx-auto max-w-5xl">
                  <div className="flex gap-3 justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 min-w-[120px]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? "Update Employee" : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </>
  );
}

// Persistent layout
EmployeeForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Employee", href: index().url },
      { title: "Form", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);