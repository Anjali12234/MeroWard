import { useState, ChangeEvent } from 'react';
import { Head, Form } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Building2, Image as ImageIcon,
    Calendar, Save,
    Type, TimerIcon,
    UserCheckIcon, ArrowLeft, UploadCloud
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from '@/types/Admin/Project';
import { store, update, index } from '@/routes/admin/project';

interface SelectOption {
    value: string | number;
    label: string;
}

interface ProjectFormProps {
    project?: Project;
    statuses?: SelectOption[];
    employees?: SelectOption[];
}

// Helper to format ISO date string to datetime-local format (YYYY-MM-DDTHH:mm)
const formatDateTimeLocal = (dateString?: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 16);
};

// Reusable Image Upload Component with Live Local Preview (matching EmployeeForm styling)
const ImageUploadField = ({ name, label, desc, project, errors }: any) => {
    const getInitialUrl = () => {
        if (!project?.[name as keyof Project]) return null;
        const rawPath = String(project[name as keyof Project]);
        if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('/')) {
            return rawPath;
        }
        return `/${rawPath}`;
    };

    const [preview, setPreview] = useState<string | null>(getInitialUrl());

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="space-y-3 group md:col-span-2">
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
                        <div className="relative w-full max-w-md aspect-video mb-4 rounded-lg overflow-hidden shadow-sm ring-1 ring-slate-200">
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

export default function ProjectForm({ project, statuses = [], employees = [] }: ProjectFormProps) {
    const isEditing = Boolean(project?.id);
    const handleCancel = () => window.history.back();

    const targetUrl = isEditing && project ? update(project.id).url : store().url;

    const statusOptions = statuses.length > 0 ? statuses : [
        { value: 'up_coming', label: 'Up Coming' },
        { value: 'on_going', label: 'On Going' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <>
            <Head title={isEditing ? "Edit Project" : "Create Project"} />

            <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {isEditing ? "Edit Project" : "Create Project"}
                            </h1>
                            <p className="text-slate-500 text-sm md:text-base">
                                {isEditing
                                    ? "Update existing project details, schedule, and assigned supervisor."
                                    : "Manage and record complete project details for your ward."}
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
                                                    {isEditing ? "Modify existing details for this record." : "Enter core details for the project or event."}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* Image Upload Field */}
                                        <ImageUploadField
                                            name="image"
                                            label="Project Image"
                                            desc="PNG, JPG or JPEG up to 2MB"
                                            project={project}
                                            errors={errors}
                                        />

                                        {/* Title Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="title" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <Type className="h-4 w-4 text-slate-500" />
                                                Title
                                            </Label>
                                            <div className="relative group">
                                                <Input
                                                    id="title"
                                                    type="text"
                                                    name="title"
                                                    placeholder="e.g. Ward Infrastructure Project"
                                                    defaultValue={project?.title}
                                                    className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                                <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            {errors?.title && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.title}</p>
                                            )}
                                        </div>

                                        {/* Supervisor Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="employee_id" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <UserCheckIcon className="h-4 w-4 text-slate-500" />
                                                Supervisor
                                            </Label>
                                            <div className="relative group">
                                                <select
                                                    id="employee_id"
                                                    name="employee_id"
                                                    defaultValue={project?.employee_id || ""}
                                                    className="w-full pl-10 pr-8 h-11 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Select Supervisor</option>
                                                    {employees.map((emp) => (
                                                        <option key={emp.value} value={emp.value}>
                                                            {emp.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <UserCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                                                    ▼
                                                </div>
                                            </div>
                                            {errors?.employee_id && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.employee_id}</p>
                                            )}
                                        </div>

                                        {/* Start Date Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="start_date" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-500" />
                                                Start Date
                                            </Label>
                                            <div className="relative group">
                                                <Input
                                                    id="start_date"
                                                    type="datetime-local"
                                                    name="start_date"
                                                    defaultValue={formatDateTimeLocal(project?.start_date)}
                                                    className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            {errors?.start_date && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.start_date}</p>
                                            )}
                                        </div>

                                        {/* Finish Date Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="finish_date" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-slate-500" />
                                                Finish Date
                                            </Label>
                                            <div className="relative group">
                                                <Input
                                                    id="finish_date"
                                                    type="datetime-local"
                                                    name="finish_date"
                                                    defaultValue={formatDateTimeLocal(project?.finish_date)}
                                                    className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            {errors?.finish_date && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.finish_date}</p>
                                            )}
                                        </div>

                                        {/* Status Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="status" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                                <TimerIcon className="h-4 w-4 text-slate-500" />
                                                Status
                                            </Label>
                                            <div className="relative group">
                                                <select
                                                    id="status"
                                                    name="status"
                                                    defaultValue={project?.status || "up_coming"}
                                                    className="w-full pl-10 pr-8 h-11 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                                                >
                                                    {statusOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <TimerIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                                                    ▼
                                                </div>
                                            </div>
                                            {errors?.status && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.status}</p>
                                            )}
                                        </div>

                                        {/* Description Field */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                rows={4}
                                                placeholder="Write detailed information about the project or event..."
                                                defaultValue={project?.description || ""}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                                            />
                                            {errors?.description && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.description}</p>
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
                                            {isEditing ? "Update Project" : "Save Changes"}
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
ProjectForm.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: "Project", href: index().url },
            { title: "Form", href: "#" },
        ]}
    >
        {page}
    </AppLayout>
);