import React from 'react';
import { Head, router } from '@inertiajs/react';

export interface Notice {
  id: number | string;
  title_en: string;
  title_ne?: string;
  slug?: string;
  notice?: string;
  status?: string;
  published_date?: string;
  created_at?: string;
  document?: unknown;
  file_path?: string;
}

interface NoticeShowProps {
  notice: Notice;
}

export default function NoticeShow({ notice }: NoticeShowProps) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.visit('/notice');
    }
  };

  // Safe resolver to retrieve clean URL/path strings (handles JSON strings, arrays, or direct strings)
  const extractFileUrl = (fileData?: unknown, fallbackPath?: string): string | null => {
    const rawData = fileData || fallbackPath;
    if (!rawData) return null;

    let pathString = rawData;

    if (Array.isArray(rawData) && rawData.length > 0) {
      pathString = rawData[0];
    } else if (typeof rawData === 'string') {
      const trimmed = rawData.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) {
            pathString = parsed[0];
          }
        } catch {
          pathString = trimmed.replace(/[\[\]\\"]/g, '');
        }
      }
    }

    if (typeof pathString === 'string' && pathString.trim() !== '') {
      const cleanPath = pathString.trim();
      if (
        cleanPath.startsWith('http://') ||
        cleanPath.startsWith('https://') ||
        cleanPath.startsWith('/')
      ) {
        return cleanPath;
      }
      return `/${cleanPath}`;
    }

    return null;
  };

  const documentUrl = extractFileUrl(notice?.document, notice?.file_path);

  // File type detection for document preview
  const lowerDocUrl = documentUrl?.toLowerCase() || '';
  const isPdf = lowerDocUrl.endsWith('.pdf') || lowerDocUrl.includes('.pdf');
  const isDocImage = ['.jpg', '.jpeg', '.png', '.webp'].some((ext) =>
    lowerDocUrl.endsWith(ext)
  );

  const getFileName = (url?: string | null) => {
    if (url) {
      return url.split('/').pop() || 'Notice Attachment';
    }
    return 'Notice Attachment';
  };

  const displayDate =
    notice?.published_date ||
    (notice?.created_at ? new Date(notice.created_at).toLocaleDateString() : 'N/A');

  return (
    <>
      <Head title={`Notice - ${notice?.title_en ?? 'Ward Notice'}`} />

      <div
        className="min-h-screen bg-cover bg-center bg-fixed py-8 px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(200, 215, 225, 0.8), rgba(180, 195, 205, 0.9)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm border border-slate-200 transition-all cursor-pointer"
            >
              ← Back
            </button>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Published: {displayDate}
            </span>
          </div>

          {/* Main Content Container */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-md border border-white/60 space-y-6">
            {/* Header Area */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
                Official Ward Notice
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {notice?.title_en || 'Untitled Notice'}
              </h1>
              {notice?.title_ne && (
                <h2 className="text-lg font-semibold text-slate-600 mt-1">
                  {notice.title_ne}
                </h2>
              )}
            </div>

            {/* Notice Text Content */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Notice Information & Details
              </h3>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 text-slate-700 text-sm leading-relaxed whitespace-pre-line min-h-[100px]">
                {notice?.notice || 'No detailed body text provided for this notice.'}
              </div>
            </div>

            {/* Attached Documents / Official Files */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span>📎</span> Official Attached File
              </h3>

              {!documentUrl ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs italic text-center">
                  No official document attachment available for this notice.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-sky-100 rounded-lg text-sky-700 font-bold text-xs uppercase">
                        {isPdf ? 'PDF' : isDocImage ? 'IMG' : 'DOC'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                          {getFileName(documentUrl)}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">
                          Downloadable File
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
                        className="flex-1 sm:flex-initial inline-flex justify-center items-center gap-1 text-xs bg-sky-800 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-sky-900 transition"
                      >
                        ↓ Download
                      </a>
                    </div>
                  </div>

                  {/* Inline PDF Viewer */}
                  {isPdf && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 h-[550px] bg-slate-100">
                      <iframe
                        src={`${documentUrl}#toolbar=0`}
                        className="w-full h-full"
                        title="Notice Document Preview"
                      />
                    </div>
                  )}

                  {/* Inline Image Preview */}
                  {isDocImage && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                      <img
                        src={documentUrl}
                        alt="Notice Document Preview"
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