import React from "react";
import { Head, router } from "@inertiajs/react";
import { Event } from "@/types/Frontend";

interface EventShowProps {
  event: Event;
}

export default function EventShow({ event }: EventShowProps) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.visit("/");
    }
  };

  // Safe resolver to retrieve clean URL string (handles JSON strings/arrays)
  const getMinutesUrl = (fileData?: unknown): string | null => {
    if (!fileData) return null;

    if (typeof fileData === "string") {
      let trimmed = fileData.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          trimmed = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : "";
        } catch {
          trimmed = trimmed.replace(/[\[\]\\"]/g, "");
        }
      }
      return trimmed !== "" ? trimmed : null;
    }

    if (Array.isArray(fileData) && fileData.length > 0) {
      return typeof fileData[0] === "string" ? fileData[0] : null;
    }

    return null;
  };

  const minuteUrl = getMinutesUrl(event?.minutes_pdf);

  // Extract file extension and determine preview type
  const lowerUrl = minuteUrl?.toLowerCase() || "";
  const isPdf = lowerUrl.endsWith(".pdf") || lowerUrl.includes(".pdf");
  const isImage = [".jpg", ".jpeg", ".png", ".webp"].some((ext) => lowerUrl.endsWith(ext));

  const getFileName = (url?: string | null) => {
    if (url) {
      return url.split("/").pop() || "Document";
    }
    return "Document";
  };

  const formatStatus = (status?: string) => {
    if (!status) return "N/A";
    return status.replace("_", " ").toUpperCase();
  };

  const getStatusBadgeStyle = (status?: string) => {
    switch (status) {
      case "ongoing":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "up_coming":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "completed":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <Head title={`Event Details - ${event?.title ?? "Ward Event"}`} />

      <div
        className="min-h-screen bg-cover bg-center bg-fixed py-8 px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(200, 215, 225, 0.8), rgba(180, 195, 205, 0.9)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm border border-slate-200 transition-all"
            >
              ← Back
            </button>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusBadgeStyle(
                event?.status
              )}`}
            >
              {formatStatus(event?.status)}
            </span>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-md border border-white/60 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
                Event Details
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {event?.title || "Untitled Event"}
              </h1>
            </div>

            {/* Event Meta Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase">Date & Time</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {event?.event_date
                    ? new Date(event.event_date).toLocaleString(undefined, {
                        dateStyle: "full",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase">Location / Venue</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {event?.location || "Ward Office / Public Hall"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Agenda & Description
              </h3>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {event?.description || "No specific details provided for this event."}
              </div>
            </div>

            {/* Attached Minutes / Document Section */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span>📎</span> Official Meeting Minutes / Documents
              </h3>

              {!minuteUrl ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs italic text-center">
                  No public minute documents uploaded for this event yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-100 rounded-lg text-red-600 font-bold text-xs uppercase">
                        {isPdf ? "PDF" : isImage ? "IMG" : "DOC"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                          {getFileName(minuteUrl)}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                          Meeting Attachment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={minuteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-1 text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold hover:bg-slate-100 transition"
                      >
                        ↗ Open
                      </a>
                      <a
                        href={minuteUrl}
                        download
                        className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-1 text-xs bg-sky-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-sky-800 transition"
                      >
                        ↓ Download
                      </a>
                    </div>
                  </div>

                  {/* Inline PDF Viewer */}
                  {isPdf && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 h-[500px] bg-slate-100">
                      <iframe
                        src={`${minuteUrl}#toolbar=0`}
                        className="w-full h-full"
                        title="Document Preview"
                      />
                    </div>
                  )}

                  {/* Inline Image Preview */}
                  {isImage && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                      <img
                        src={minuteUrl}
                        alt="Document Preview"
                        className="w-full h-auto max-h-[500px] object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}