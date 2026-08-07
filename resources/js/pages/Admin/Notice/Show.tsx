import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Edit, FileText, Calendar, Globe, FileIcon, Download, ExternalLink, Paperclip 
} from "lucide-react";
import { Notice } from "@/types/Admin/Notice";
import { edit, index } from "@/routes/admin/notice";

interface NoticeShowProps {
  notice: Notice;
}

export default function NoticeShow({ notice }: NoticeShowProps) {
  const handleBack = () => window.history.back();

  // Helper to determine file type category
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return 'image';
    }
    if (extension === 'pdf') {
      return 'pdf';
    }
    return 'document';
  };

  // Helper to extract clean filename from URL
  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Download File';
  };

  const documents = Array.isArray(notice?.document) ? notice.document : [];

  return (
    <>
      <Head title={`Notice - ${notice?.title_en ?? "Details"}`} />
      <div className="flex h-full flex-1 flex-col gap-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <p className="text-muted-foreground text-sm">
                View notice information and attached files
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href={edit(notice.id).url}>
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Information Card */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">
                  Notice Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* English Title */}
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" /> English Title
                    </h3>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {notice.title_en || "N/A"}
                    </p>
                  </div>

                  {/* Nepali Title */}
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400" /> Nepali Title
                    </h3>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {notice.title_ne || "N/A"}
                    </p>
                  </div>

                  {/* Published Date */}
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Published Date
                    </h3>
                    {notice.published_date ? (
                      <Badge className="mt-1 bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 border-blue-200 font-normal text-sm px-2.5 py-0.5">
                        {notice.published_date}
                      </Badge>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">N/A</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attached Documents Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  Attached Documents ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No attached documents found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((fileUrl, index) => {
                      const fileType = getFileType(fileUrl);
                      const fileName = getFileName(fileUrl);

                      return (
                        <div
                          key={index}
                          className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                              <FileIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium text-slate-900 truncate" title={fileName}>
                                {fileName}
                              </p>
                              <p className="text-xs text-slate-500 uppercase font-semibold">
                                {fileType}
                              </p>
                            </div>
                          </div>

                          {/* Image Render */}
                          {fileType === 'image' && (
                            <div className="overflow-hidden rounded-md border border-slate-200 bg-white max-h-48 flex items-center justify-center">
                              <img
                                src={fileUrl}
                                alt={fileName}
                                className="object-cover h-full w-full hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2 border-t border-slate-200/60">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="w-full text-xs flex items-center justify-center gap-1.5 bg-white"
                            >
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3.5 w-3.5" />
                                View
                              </a>
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              asChild
                              className="w-full text-xs flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700"
                            >
                              <a href={fileUrl} download>
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
}

NoticeShow.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      {
        title: "Notice",
        href: index().url,
      },
      {
        title: "View",
        href: "#",
      },
    ]}
  >
    {page}
  </AppLayout>
);