import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UploadCloud, Save, ArrowLeft, ExternalLink, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event } from "@/types/Admin/Event";
import { uploadMinute } from "@/routes/admin";
import { index } from "@/routes/admin/event";

interface EventFormProps {
  event?: Event;
}

interface MinuteUploadFieldProps {
  name: keyof Event;
  label: string;
  desc: string;
  event?: Event;
  errors?: Record<string, string>;
  selectedFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MinuteUploadField = ({
  name,
  label,
  desc,
  event,
  errors,
  selectedFile,
  onChange,
}: MinuteUploadFieldProps) => {
  const existingUrl = event?.[name] as string | undefined;

  // Local state to store preview URL (supports both newly uploaded File and existing backend URL)
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // Clean up memory when file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(existingUrl || null);
    }
  }, [selectedFile, existingUrl]);

  // Safe checks for PDF extension or MIME type
  const isPdf =
    selectedFile?.type === "application/pdf" ||
    (typeof previewUrl === "string" && previewUrl.toLowerCase().includes(".pdf"));

  return (
    <div className="space-y-4">
      <Label htmlFor={name} className="text-sm font-medium text-slate-700 block">
        {label}
      </Label>

      {/* Upload Zone */}
      <div className="group relative overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-all duration-300">
        <Input
          type="file"
          name={name}
          id={name}
          accept="image/*,.pdf"
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="mb-3 p-4 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : existingUrl
                ? "Click to replace current file"
                : "Click to upload file"}
            </p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        </div>
      </div>

      {errors?.[name] && (
        <p className="text-red-500 text-xs font-medium animate-in slide-in-from-top-1">
          {errors[name]}
        </p>
      )}

      {/* File Preview Section */}
      {previewUrl && (
        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-3.5 bg-slate-100/70 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-red-100 rounded-md shrink-0">
                <FileText className="h-5 w-5 text-red-600" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {selectedFile ? selectedFile.name : "Current Minute Document"}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedFile ? "Selected local file" : "Attached Document"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" variant="outline" asChild className="bg-white">
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  View
                </a>
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <a href={previewUrl} download={selectedFile?.name || "minute-document"}>
                  <Download className="h-4 w-4 mr-1.5" />
                  Download
                </a>
              </Button>
            </div>
          </div>

          {/* Embedded PDF Preview */}
          {isPdf && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 h-96 bg-white shadow-inner">
              <iframe
                src={`${previewUrl}#toolbar=0`}
                className="w-full h-full"
                title="Minute PDF Preview"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function EventForm({ event }: EventFormProps) {
  const handleCancel = () => window.history.back();

  const { data, setData, post, processing, errors } = useForm<{
    minutes_pdf: File | null;
  }>({
    minutes_pdf: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?.id) return;

    post(uploadMinute(event.id).url, {
      preserveScroll: true,
      forceFormData: true, // Ensures Inertia sends file payloads correctly as multipart/form-data
    });
  };

  return (
    <>
      <Head title="Event Minute Management" />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Manage Minute Document
              </h1>
              <p className="text-slate-500 text-sm">
                Upload and manage minute records for this event.
              </p>
            </div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Minute Document
                    </CardTitle>
                    <CardDescription>
                      Upload the officially signed PDF or image file.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <MinuteUploadField
                  name="minutes_pdf"
                  label="Upload Minute File"
                  desc="PNG, JPG, JPEG, or PDF up to 10MB"
                  event={event}
                  errors={errors}
                  selectedFile={data.minutes_pdf}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files?.[0]) {
                      setData("minutes_pdf", e.target.files[0]);
                    }
                  }}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 min-w-[140px]"
              >
                <Save className="h-4 w-4 mr-2" />
                {processing ? "Saving..." : "Save Minute"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

EventForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Event", href: index().url },
      { title: "Upload Minute", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);