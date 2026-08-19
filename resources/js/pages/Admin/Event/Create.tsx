import { useState, useEffect } from 'react'
import { Head, Form } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2, Image as ImageIcon,
  MapPin, Calendar, UploadCloud, Save, Navigation,
  Type, FileText,
  BuildingIcon,
  TimerIcon,
  UserCheckIcon,
  ArrowLeft
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { store, index } from '@/routes/admin/event'
import { Event } from '@/types/Admin/Event'

interface StatusOption {
  value: string;
  label: string;
}

interface EventFormProps {
  event?: Event;
  statuses?: StatusOption[];
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
const FormSelectField = ({ name, label, icon: Icon, defaultValue, options = [], errors }: any) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-sm font-medium text-slate-700 flex items-center gap-2">
      {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      {label}
    </Label>
    <div className="relative group">
      <select
        id={name}
        name={name}
        defaultValue={defaultValue !== undefined ? String(defaultValue) : "up_coming"}
        className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-md bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="" disabled>Select Status</option>
        {options.map((option: StatusOption) => (
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

export default function EventForm({ event, statuses = [] }: EventFormProps) {
  const handleCancel = () => window.history.back();

  // Fallback options in case controller props aren't passed
  const statusOptions = statuses.length > 0 ? statuses : [
    { value: 'up_coming', label: 'Up Coming' },
    { value: 'on_going', label: 'On Going' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <Head title="Event" />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Event</h1>
              <p className="text-slate-500 text-sm md:text-base">
                Manage the complete event of ward.
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
                        <CardDescription>Enter the core details about your Event.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    <FormInputField
                      name="title"
                      label="Title"
                      icon={Type}
                      placeholder="e.g. Ward Assembly Meeting"
                      defaultValue={event?.title}
                      errors={errors}
                    />

                    <FormInputField
                      name="location"
                      label="Location"
                      icon={MapPin}
                      type="text"
                      placeholder="Venue"
                      defaultValue={event?.location}
                      errors={errors}
                    />

                    <FormInputField
                      name="event_date"
                      label="Event Date"
                      icon={Calendar}
                      type="datetime-local"
                      defaultValue={event?.event_date}
                      errors={errors}
                    />

                    <FormSelectField
                      name="status"
                      label="Status"
                      icon={UserCheckIcon}
                      defaultValue={event?.status ?? 'up_coming'}
                      options={statusOptions}
                      errors={errors}
                    />

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        defaultValue={event?.description}
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
EventForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "event", href: index().url },
      { title: "Create/Edit", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);