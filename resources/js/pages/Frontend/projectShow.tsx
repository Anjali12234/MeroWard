import React from "react";
import { Head, router } from "@inertiajs/react";

export type Employee = {
  id: number;
  name: string;
  image: string;
  designation: string;
  section: string;
  position: string;
  email: string;
  phone: string;
  ward_no: string;
  is_employee: boolean;
};

export interface ProjectItem {
  id: number | string;
  title: string;
  description?: string;
  slug?: string;
  image?: unknown;
  status?: "up_coming" | "on_going" | "completed" | "cancelled" | string;
  start_date?: string;
  finish_date?: string;
  budget?: string | number;
  location?: string;
  document?: unknown;
  employee_id?: number | string;
  employee?: Employee | null;
}

interface ProjectShowProps {
  project: ProjectItem;
}

export default function ProjectShow({ project }: ProjectShowProps) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.visit("/");
    }
  };

  const extractFileUrl = (fileData?: unknown): string | null => {
    if (!fileData) return null;

    let pathString = fileData;

    if (Array.isArray(fileData) && fileData.length > 0) {
      pathString = fileData[0];
    } else if (typeof fileData === "string") {
      const trimmed = fileData.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) {
            pathString = parsed[0];
          }
        } catch {
          pathString = trimmed.replace(/[\[\]\\"]/g, "");
        }
      }
    }

    if (typeof pathString === "string" && pathString.trim() !== "") {
      const cleanPath = pathString.trim();
      if (
        cleanPath.startsWith("http://") ||
        cleanPath.startsWith("https://") ||
        cleanPath.startsWith("/")
      ) {
        return cleanPath;
      }
      return `/${cleanPath}`;
    }

    return null;
  };

  const projectImageUrl = extractFileUrl(project?.image);
  const documentUrl = extractFileUrl(project?.document);

  const lowerDocUrl = documentUrl?.toLowerCase() || "";
  const isPdf = lowerDocUrl.endsWith(".pdf") || lowerDocUrl.includes(".pdf");
  const isDocImage = [".jpg", ".jpeg", ".png", ".webp"].some((ext) =>
    lowerDocUrl.endsWith(ext)
  );

  const getFileName = (url?: string | null) => {
    if (url) {
      return url.split("/").pop() || "Project Document";
    }
    return "Project Document";
  };

  const formatStatus = (status?: string) => {
    if (!status) return "N/A";
    return status.replace("_", " ").toUpperCase();
  };

  const getStatusBadgeStyle = (status?: string) => {
    switch (status) {
      case "on_going":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "up_coming":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatCurrency = (amount?: string | number) => {
    if (!amount) return "N/A";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(num) ? amount.toString() : `NPR ${num.toLocaleString()}`;
  };

  return (
    <>
      <Head title={`Project Details - ${project?.title ?? "Ward Project"}`} />

      <div
        className="min-h-screen bg-cover bg-center bg-fixed py-8 px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(200, 215, 225, 0.8), rgba(180, 195, 205, 0.9)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm border border-slate-200 transition-all cursor-pointer"
            >
              ← Back
            </button>
            <span
              className={`text-xs px-3 py-1 rounded-full font-bold border ${getStatusBadgeStyle(
                project?.status
              )}`}
            >
              {formatStatus(project?.status)}
            </span>
          </div>

          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-md border border-white/60 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
                Development & Ward Project
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {project?.title || "Untitled Project"}
              </h1>
            </div>

            {projectImageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 shadow-inner bg-slate-100">
                <img
                  src={projectImageUrl}
                  alt={project?.title || "Project Image"}
                  className="w-full h-full object-cover max-h-96"
                />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase">Timeline</p>
                <p className="mt-1 font-semibold text-slate-800 text-xs">
                  {project?.start_date || "N/A"} — {project?.finish_date || "Present"}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase">Estimated Budget</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formatCurrency(project?.budget)}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase">Project Location</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {project?.location || "Ward Area"}
                </p>
              </div>
            </div>

            {/* Assigned Employee / Supervisor Section */}
            {project?.employee ? (
              <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {project.employee.image && (
                    <img
                      src={extractFileUrl(project.employee.image) || project.employee.image}
                      alt={project.employee.name}
                      className="w-12 h-12 rounded-full object-cover border border-sky-200 shadow-sm"
                    />
                  )}
                  <div>
                    <p className="text-[10px] font-bold uppercase text-sky-700 tracking-wider">
                      Project Supervisor / Officer
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {project.employee.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {project.employee.designation || project.employee.position}
                      {project.employee.section ? ` • ${project.employee.section}` : ""}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-600 space-y-0.5">
                  {project.employee.phone && <p>📞 {project.employee.phone}</p>}
                  {project.employee.email && <p>✉️ {project.employee.email}</p>}
                  {project.employee.ward_no && (
                    <p className="text-[10px] text-slate-400 font-medium">
                      Ward No: {project.employee.ward_no}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-500 text-xs italic">
                No officer or employee assigned to this project.
              </div>
            )}

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Project Scope & Details
              </h3>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {project?.description || "No detailed description provided for this project."}
              </div>
            </div>

            {/* Document Attachments */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span>📎</span> Official Project Reports & Specifications
              </h3>

              {!documentUrl ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs italic text-center">
                  No public specifications or report documents attached to this project.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-sky-100 rounded-lg text-sky-700 font-bold text-xs uppercase">
                        {isPdf ? "PDF" : isDocImage ? "IMG" : "DOC"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                          {getFileName(documentUrl)}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                          Project File Attachment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <a
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-1 text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold hover:bg-slate-100 transition"
                      >
                        ↗ Open
                      </a>
                      <a
                        href={documentUrl}
                        download
                        className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-1 text-xs bg-sky-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-sky-800 transition"
                      >
                        ↓ Download
                      </a>
                    </div>
                  </div>

                  {isPdf && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 h-[500px] bg-slate-100">
                      <iframe
                        src={`${documentUrl}#toolbar=0`}
                        className="w-full h-full"
                        title="Project Document Preview"
                      />
                    </div>
                  )}

                  {isDocImage && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                      <img
                        src={documentUrl}
                        alt="Project Document Preview"
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