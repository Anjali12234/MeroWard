import { useState } from 'react'
import { Head, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2, Save, ArrowLeft, Calendar, FileText, Globe, UploadCloud, X, Paperclip
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import { Notice } from '@/types/Admin/Notice'
import { index, store, update } from '@/routes/admin/notice'

interface NoticeFormProps {
  notice?: Notice;
}

const FormInputField = ({ name, label, icon: Icon, type = "text", placeholder, value, onChange, errors, className = '' }: any) => (
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
        value={value}
        onChange={onChange}
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

export default function NoticeForm({ notice }: NoticeFormProps) {
  const isEditing = Boolean(notice?.id);

  const [titleEn, setTitleEn] = useState(notice?.title_en || '');
  const [titleNe, setTitleNe] = useState(notice?.title_ne || '');
  const [publishedDate, setPublishedDate] = useState(
    notice?.published_date || new Date().toISOString().split('T')[0]
  );

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  const handleCancel = () => window.history.back();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    const formData = new FormData();
    formData.append('title_en', titleEn);
    formData.append('title_ne', titleNe);
    formData.append('published_date', publishedDate);

    // Key must match 'document' expected by StoreNoticeRequest validation
    files.forEach((file, idx) => {
      formData.append(`document[${idx}]`, file);
    });

    if (isEditing) {
      formData.append('_method', 'PUT');
    }

    const targetUrl = isEditing ? update(notice!.id).url : store().url;

    router.post(targetUrl, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success(isEditing ? 'Notice Updated Successfully' : 'Notice Created Successfully');
      },
      onError: (errs) => {
        setErrors(errs);
        toast.error('Please check the form for errors.');
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  return (
    <>
      <Head title={isEditing ? "Edit Notice" : "Create Notice"} />

      <div className="min-h-full bg-slate-50/50 p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {isEditing ? "Edit Notice" : "Create Notice"}
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Manage your official notices and supporting documents.
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
                    <CardTitle className="text-lg font-semibold text-slate-800">Notice Details</CardTitle>
                    <CardDescription>Fill in title, publication date, and attach files.</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <FormInputField
                    name="title_en"
                    label="English Title"
                    icon={Globe}
                    placeholder="Enter English Title"
                    value={titleEn}
                    onChange={(e: any) => setTitleEn(e.target.value)}
                    errors={errors}
                  />

                  <FormInputField
                    name="title_ne"
                    label="Nepali Title"
                    icon={FileText}
                    placeholder="नेपाली शीर्षक"
                    value={titleNe}
                    onChange={(e: any) => setTitleNe(e.target.value)}
                    errors={errors}
                  />

                  <div className="md:col-span-2">
                    <FormInputField
                      name="published_date"
                      label="Published Date"
                      type="date"
                      icon={Calendar}
                      value={publishedDate}
                      onChange={(e: any) => setPublishedDate(e.target.value)}
                      errors={errors}
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-3">
                  <Label htmlFor="document" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-slate-500" />
                    Documents
                  </Label>
                  <Input
                    id="document"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-slate-500">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                  </p>

                  {/* Display validation error for document */}
                  {errors.document && (
                    <p className="text-red-500 text-xs font-medium">{errors.document}</p>
                  )}

                  {/* Selected Files List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold text-slate-600">Attached Files:</p>
                      <div className="flex flex-wrap gap-2">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700"
                          >
                            <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                            <span className="truncate max-w-[180px]">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            <div className="sticky bottom-4 z-10 mx-auto max-w-5xl">
              <div className="flex gap-3 justify-end">
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 min-w-[120px]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

NoticeForm.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      { title: "Notice", href: index().url },
      { title: "Create/Edit", href: "#" },
    ]}
  >
    {page}
  </AppLayout>
);