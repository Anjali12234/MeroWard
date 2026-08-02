import { Head, Form } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  TimerIcon,
  ArrowLeft,
  Briefcase,
  UserCheck,
  Banknote,
  Save
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { Service } from '@/types/Admin/Service'
import { index, store } from '@/routes/admin/service'

interface EmployeeOption {
  id: number | string;
  name: string;
  is_employee?: number | boolean;
}

interface ServiceFormProps {
  service?: Service & { employee_ids?: (number | string)[] };
  employees?: EmployeeOption[];
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

// Reusable Multi-Select Dropdown Field Component
const FormMultiSelectField = ({ name, label, icon: Icon, defaultValue = [], options, errors }: any) => {
  // Convert initial values to strings for standard select element comparison
  const defaultValuesFormatted = Array.isArray(defaultValue)
    ? defaultValue.map(String)
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
        {label}
        <span className="text-xs font-normal text-slate-400">(Hold Ctrl/Cmd to select multiple)</span>
      </Label>
      <div className="relative group">
        <select
          id={name}
          name={`${name}[]`} // Sends as array payload to Laravel (e.g., employee_ids[])
          multiple
          defaultValue={defaultValuesFormatted}
          className="w-full p-2.5 h-32 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-inner scrollbar-thin"
        >
          {options.map((option: { label: string; value: string | number }) => (
            <option key={option.value} value={option.value} className="p-1.5 hover:bg-slate-100 rounded">
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1 font-medium animate-in slide-in-from-top-1">{errors[name]}</p>
      )}
    </div>
  );
};

export default function ServiceForm({ service, employees = [] }: ServiceFormProps) {
  const handleCancel = () => window.history.back();

  // Format options with (Employee) or (Representative) tag
  const employeeOptions = employees.map((emp) => {
    const roleTag = Number(emp.is_employee) === 1 ? 'Employee' : 'Representative';
    
    return {
      label: `${emp.name} (${roleTag})`,
      value: emp.id,
    };
  });

  return (
    <>
      <Head title="Service" />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Service</h1>
              <p className="text-slate-500 text-sm md:text-base">
                Manage all service details of the ward.
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
            action={store().url}
            method="post"
            className="space-y-8"
            options={{
              preserveScroll: true,
              onSuccess: () => {
                toast.success('Service Saved Successfully');
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
                        <CardDescription>Enter the core details about the ward service.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Service Name */}
                    <FormInputField
                      name="service_name"
                      label="Service Name"
                      icon={Briefcase}
                      placeholder="e.g. Citizenship Recommendation"
                      defaultValue={service?.service_name}
                      errors={errors}
                    />

                    {/* Multiple Person Selection */}
                    <FormMultiSelectField
                      name="employee_ids"
                      label="Assigned Persons"
                      icon={UserCheck}
                      defaultValue={service?.employee_ids || []}
                      options={employeeOptions}
                      errors={errors}
                    />

                    {/* Time Required */}
                    <FormInputField
                      name="time"
                      label="Time Required"
                      icon={TimerIcon}
                      type="text"
                      placeholder="e.g. 1 Hour / Same Day"
                      defaultValue={service?.time}
                      errors={errors}
                    />

                    {/* Required Price */}
                    <FormInputField
                      name="price"
                      label="Required Price (NPR)"
                      icon={Banknote}
                      type="text"
                      placeholder="e.g. 100"
                      defaultValue={service?.price}
                      errors={errors}
                    />

                    {/* Required Document */}
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="required_documents" className="text-sm font-medium text-slate-700">
                        Required Documents
                      </Label>
                      <Textarea
                        id="required_documents"
                        name="required_documents"
                        rows={4}
                        placeholder="Brief description of required documents..."
                        defaultValue={service?.required_documents || ""}
                        className="resize-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                      />
                      {errors?.required_documents && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.required_documents}</p>
                      )}
                    </div>

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
  );
}

// Attach persistent layout
ServiceForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Service", href: index().url },
      { title: "Create/Edit", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);