import { Head, Form } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, Save, ArrowLeft, Type, MapPin, Calendar, UserCheckIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event } from "@/types/Admin/Event";
import { index, store, update } from "@/routes/admin/event";
import { Textarea } from "@/components/ui/textarea";

interface StatusOption {
  value: string;
  label: string;
}

interface EventFormProps {
  event?: Event;
  statuses?: StatusOption[];
}

const DEFAULT_STATUSES: StatusOption[] = [
  { value: "up_coming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

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
        defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : "up_coming"}
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

export default function EventForm({ event, statuses }: EventFormProps) {
  const isEditing = Boolean(event?.id);
  const handleCancel = () => window.history.back();

  const optionsToUse = statuses && statuses.length > 0 ? statuses : DEFAULT_STATUSES;
  const targetUrl = isEditing && event ? update({ event: event.id }).url : store().url;

  return (
    <>
      <Head title={isEditing ? "Edit Event" : "Create Event"} />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {isEditing ? "Edit Event" : "Create Event"}
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                {isEditing
                  ? "Update event details, date, location, and status."
                  : "Add a new event to your system."}
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
            options={{ preserveScroll: true }}
          >
            {({ errors }) => (
              <>
                {/* Method Spoofing for Laravel Updates */}
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
                          {isEditing ? "Modify existing details for this event." : "Enter core details for the new event."}
                        </CardDescription>
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
                      defaultValue={event?.status ?? "up_coming"}
                      options={optionsToUse}
                      errors={errors}
                    />

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Enter event details or agenda..."
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
                      {isEditing ? "Update Event" : "Save Event"}
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

EventForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Event", href: index().url },
      { title: "Form", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);