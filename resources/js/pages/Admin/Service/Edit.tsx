import { Head, useForm } from "@inertiajs/react"
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
import { index, update } from '@/routes/admin/service'

interface EmployeeOption {
  id: number | string;
  name: string;
  is_employee?: number | boolean;
}

interface ServiceEditFormProps {
  service: Service & { 
    employee_ids?: (number | string)[];
    employees?: { id: number | string }[];
  };
  employees?: EmployeeOption[];
}

export default function EditServiceForm({ service, employees = [] }: ServiceEditFormProps) {
  const handleCancel = () => window.history.back();

  // Extract selected IDs
  const defaultEmployeeIds = service.employees
    ? service.employees.map((emp) => String(emp.id))
    : (service.employee_ids || []).map(String);

  // Initialize Inertia form hook directly
  const { data, setData, put, processing, errors } = useForm({
    service_name: service.service_name || "",
    employee_ids: defaultEmployeeIds,
    time: service.time || "",
    price: service.price || "",
    required_documents: service.required_documents || "",
  });

  const employeeOptions = employees.map((emp) => {
    const roleTag = Number(emp.is_employee) === 1 ? 'Employee' : 'Representative';
    return {
      label: `${emp.name} (${roleTag})`,
      value: String(emp.id),
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Native Inertia PUT request to update route
    put(update(service.id).url, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Service Updated Successfully');
      },
    });
  };

  return (
    <>
      <Head title="Edit Service" />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Edit Service
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Update existing ward service details.
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

          <form onSubmit={handleSubmit} className="space-y-8">
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
                <div className="space-y-2">
                  <Label htmlFor="service_name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-500" />
                    Service Name
                  </Label>
                  <div className="relative group">
                    <Input
                      id="service_name"
                      type="text"
                      placeholder="e.g. Citizenship Recommendation"
                      value={data.service_name}
                      onChange={(e) => setData('service_name', e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  {errors.service_name && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.service_name}</p>
                  )}
                </div>

                {/* Assigned Persons (Multi-Select) */}
                <div className="space-y-2">
                  <Label htmlFor="employee_ids" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-slate-500" />
                    Assigned Persons
                    <span className="text-xs font-normal text-slate-400">(Hold Ctrl/Cmd to select multiple)</span>
                  </Label>
                  <select
                    id="employee_ids"
                    multiple
                    value={data.employee_ids}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                      setData('employee_ids', selectedOptions);
                    }}
                    className="w-full p-2.5 h-32 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer shadow-inner scrollbar-thin"
                  >
                    {employeeOptions.map((option) => (
                      <option key={option.value} value={option.value} className="p-1.5 hover:bg-slate-100 rounded">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.employee_ids && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.employee_ids}</p>
                  )}
                </div>

                {/* Time Required */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <TimerIcon className="h-4 w-4 text-slate-500" />
                    Time Required
                  </Label>
                  <div className="relative group">
                    <Input
                      id="time"
                      type="text"
                      placeholder="e.g. 1 Hour / Same Day"
                      value={data.time}
                      onChange={(e) => setData('time', e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <TimerIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  {errors.time && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.time}</p>
                  )}
                </div>

                {/* Required Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-slate-500" />
                    Required Price (NPR)
                  </Label>
                  <div className="relative group">
                    <Input
                      id="price"
                      type="text"
                      placeholder="e.g. 100"
                      value={data.price}
                      onChange={(e) => setData('price', e.target.value)}
                      className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.price}</p>
                  )}
                </div>

                {/* Required Documents */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="required_documents" className="text-sm font-medium text-slate-700">
                    Required Documents
                  </Label>
                  <Textarea
                    id="required_documents"
                    rows={4}
                    placeholder="Brief description of required documents..."
                    value={data.required_documents}
                    onChange={(e) => setData('required_documents', e.target.value)}
                    className="resize-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
                  />
                  {errors.required_documents && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.required_documents}</p>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Submit Action */}
            <div className="sticky bottom-4 z-10 mx-auto max-w-5xl">
              <div className="flex gap-3 justify-end">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 min-w-[120px]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {processing ? "Updating..." : "Update Service"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

EditServiceForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Service", href: index().url },
      { title: "Edit Form", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);