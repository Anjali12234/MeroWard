import { useState, ChangeEvent } from 'react'
import { Head, Form } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2, Image as ImageIcon,
  Calendar, Save,
  Type, TimerIcon,
  UserCheckIcon, ArrowLeft, UploadCloud, X
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Project } from '@/types/Admin/Project'
import { store, index } from '@/routes/admin/project'

interface SelectOption {
  value: string | number;
  label: string;
}

interface ProjectFormProps {
  project?: Project;
  statuses?: SelectOption[];
  employees?: SelectOption[];
}

// Reusable Image Upload Field Component
const ImageUploadField = ({ name, label, desc, project, errors }: any) => {
  const [preview, setPreview] = useState<string | null>(project?.image ? `/${project.image}` : null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setPreview(null);
    const input = document.getElementById(name) as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-slate-500" />
        {label}
      </Label>
      
      <div className="flex items-center gap-6">
        {preview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm group">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={name}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
              <p className="text-xs text-slate-500 font-medium">Click to upload or drag & drop</p>
              <p className="text-[11px] text-slate-400 mt-1">{desc}</p>
            </div>
          </label>
        )}

        <input
          id={name}
          name={name}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={preview ? "hidden" : "hidden"}
        />
      </div>

      {errors?.[name] && (
        <p className="text-red-500 text-xs mt-1 font-medium animate-in slide-in-from-top-1">{errors[name]}</p>
      )}
    </div>
  );
};

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
const FormSelectField = ({ name, label, icon: Icon, defaultValue, options = [], errors, placeholder = "Select Option" }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-slate-700 flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      {label}
    </Label>
    <div className="relative group">
      <select
        id={name}
        name={name}
        defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ""}
        className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option: SelectOption) => (
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

export default function ProjectForm({ project, statuses = [], employees = [] }: ProjectFormProps) {
  const handleCancel = () => window.history.back();

  const statusOptions = statuses.length > 0 ? statuses : [
    { value: 'up_coming', label: 'Up Coming' },
    { value: 'on_going', label: 'On Going' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <Head title="Project" />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Project</h1>
              <p className="text-slate-500 text-sm md:text-base">
                Manage the complete project of ward.
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
            encType="multipart/form-data"
            className="space-y-8"
            options={{
              preserveScroll: true,
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
                        <CardDescription>Enter the core details about your Project/Event.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadField
                      name="image"
                      label="Project Image"
                      desc="PNG, JPG or JPEG up to 2MB"
                      project={project}
                      errors={errors}
                    />

                    <FormInputField
                      name="title"
                      label="Title"
                      icon={Type}
                      placeholder="e.g. Ward Assembly Meeting"
                      defaultValue={project?.title}
                      errors={errors}
                    />

                    <FormSelectField
                      name="employee_id"
                      label="Supervisor"
                      icon={UserCheckIcon}
                      defaultValue={project?.employee_id ?? ''}
                      options={employees}
                      placeholder="Select Supervisor"
                      errors={errors}
                    />

                    <FormInputField
                      name="start_date"
                      label="Start Date"
                      icon={Calendar}
                      type="datetime-local"
                      defaultValue={project?.start_date}
                      errors={errors}
                    />

                    <FormInputField
                      name="finish_date"
                      label="Finish Date"
                      icon={Calendar}
                      type="datetime-local"
                      defaultValue={project?.finish_date}
                      errors={errors}
                    />

                    <FormSelectField
                      name="status"
                      label="Status"
                      icon={TimerIcon}
                      defaultValue={project?.status ?? 'up_coming'}
                      options={statusOptions}
                      placeholder="Select Status"
                      errors={errors}
                    />

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        defaultValue={project?.description}
                        rows={6}
                      />
                      {errors?.description && (
                        <p className="text-red-500 text-xs mt-1 font-medium animate-in slide-in-from-top-1">{errors.description}</p>
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
ProjectForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Project", href: index().url },
      { title: "Create/Edit", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);