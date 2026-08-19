import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Edit, Image as ImageIcon, Calendar, MapPin, 
  FileText, Activity, Clock, Paperclip, Download, ExternalLink, FileIcon
} from "lucide-react";
import { Event } from "@/types/Admin/Event";
import { edit, index } from "@/routes/admin/event";

interface EventShowProps {
  event: Event;
}

export default function EventShow({ event }: EventShowProps) {
  const handleBack = () => window.history.back();

  // Helper for status badge formatting
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100";
      case "up_coming":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
      case "completed":
        return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-100";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const formatStatusText = (status: string) => {
    return status?.replace("_", " ").toUpperCase() || "UNKNOWN";
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "Document.pdf";
  };

  return (
    <>
      <Head title={`Event - ${event?.title ?? "Details"}`} />
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
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">Event Details</h1>
                <Badge className={`font-medium text-xs px-2.5 py-0.5 ${getStatusBadge(event?.status)}`}>
                  {formatStatusText(event?.status)}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                View detailed information and attached minute documents for this event
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link href={edit(event.id).url}>
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        

          {/* Right Column: Event Details & Minute PDF */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800">Overview</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Title & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-400" /> Event Title
                    </h3>
                    <p className="mt-1 text-base font-semibold text-slate-900">{event.title || "N/A"}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-slate-400" /> Status
                    </h3>
                    <div className="mt-1">
                      <Badge className={`font-normal text-sm px-2.5 py-0.5 ${getStatusBadge(event?.status)}`}>
                        {formatStatusText(event?.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Event Date & Time
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-800 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {event.event_date ? new Date(event.event_date).toLocaleString() : "N/A"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location / Venue
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-800">{event.location || "N/A"}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description / Agenda
                  </h3>
                  <div className="mt-2 text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-line">
                    {event.description || "No description provided."}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attached Minute PDF Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  Meeting Minutes (PDF)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!event.minutes_pdf ? (
                  <p className="text-sm text-muted-foreground italic">No minute PDF document attached.</p>
                ) : (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col justify-between space-y-3 max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <FileIcon className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 truncate" title={getFileName(event.minutes_pdf)}>
                          {getFileName(event.minutes_pdf)}
                        </p>
                        <p className="text-xs text-slate-500 uppercase font-semibold">
                          PDF Document
                        </p>
                      </div>
                    </div>

                    {/* PDF Actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200/60">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full text-xs flex items-center justify-center gap-1.5 bg-white"
                      >
                        <a href={event.minutes_pdf} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                          View PDF
                        </a>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="w-full text-xs flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <a href={event.minutes_pdf} download>
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </Button>
                    </div>
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

EventShow.layout = (page: React.ReactNode) => (
  <AppLayout
    breadcrumbs={[
      {
        title: "Event",
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