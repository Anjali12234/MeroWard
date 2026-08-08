import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
  Search, FileText, Calendar, Globe, ExternalLink, Download, Paperclip 
} from 'lucide-react';

export interface Notice {
  id: number;
  title_en: string;
  title_ne?: string;
  published_date?: string;
  document?: string[];
}

interface NoticeIndexProps {
  notices: Notice[];
}

export default function NoticeIndex({ notices = [] }: NoticeIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to determine file type category
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'document';
  };

  // Helper to extract clean filename from URL
  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Attached File';
  };

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const term = searchTerm.toLowerCase();
      const matchesTitleEn = notice.title_en?.toLowerCase().includes(term);
      const matchesTitleNe = notice.title_ne?.toLowerCase().includes(term);
      const matchesDate = notice.published_date?.toLowerCase().includes(term);

      return matchesTitleEn || matchesTitleNe || matchesDate;
    });
  }, [notices, searchTerm]);

  return (
    <>
      <Head title="Public Notices Directory" />
      <div className="min-h-screen bg-slate-100 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header Banner */}
          <div className="bg-sky-800 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Public Notices & Announcements</h1>
              <p className="text-xs text-sky-200 mt-1">
                Official notices, press releases, and downloadable documents
              </p>
            </div>
            <span className="bg-sky-700 text-sky-100 px-3 py-1 rounded-full text-xs font-medium">
              Total Notices: {notices.length}
            </span>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notices by title or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-sky-900 text-white text-xs uppercase tracking-wider font-semibold border-b border-sky-950">
                    <th className="py-3.5 px-4 w-12 text-center border-r border-sky-800">S.N.</th>
                    <th className="py-3.5 px-4 w-1/3 border-r border-sky-800">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" /> English Title
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-1/3 border-r border-sky-800">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Nepali Title
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-36 border-r border-sky-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Published Date
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5" /> Attachments
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                  {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice, index) => {
                      const documents = Array.isArray(notice.document) ? notice.document : [];

                      return (
                        <tr key={notice.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* S.N. */}
                          <td className="py-4 px-4 text-center font-medium text-slate-500 align-top border-r border-slate-100">
                            {index + 1}
                          </td>

                          {/* English Title */}
                          <td className="py-4 px-4 font-bold text-slate-900 align-top border-r border-slate-100">
                            {notice.title_en || <span className="text-slate-400 italic">N/A</span>}
                          </td>

                          {/* Nepali Title */}
                          <td className="py-4 px-4 font-medium text-slate-800 align-top border-r border-slate-100">
                            {notice.title_ne || <span className="text-slate-400 italic">N/A</span>}
                          </td>

                          {/* Published Date */}
                          <td className="py-4 px-4 align-top border-r border-slate-100">
                            {notice.published_date ? (
                              <span className="inline-block bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-md text-[11px] font-medium">
                                {notice.published_date}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">N/A</span>
                            )}
                          </td>

                          {/* Attachments / Action Downloads */}
                          <td className="py-4 px-4 align-top">
                            {documents.length > 0 ? (
                              <div className="space-y-2">
                                {documents.map((fileUrl, docIdx) => {
                                  const fileName = getFileName(fileUrl);
                                  const fileType = getFileType(fileUrl);

                                  return (
                                    <div
                                      key={docIdx}
                                      className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex items-center justify-between gap-2"
                                    >
                                      <div className="overflow-hidden pr-2">
                                        <p className="text-[11px] font-semibold text-slate-800 truncate" title={fileName}>
                                          {fileName}
                                        </p>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">
                                          {fileType}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1 shrink-0">
                                        <a
                                          href={fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                                          title="View Document"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <a
                                          href={fileUrl}
                                          download
                                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                          title="Download Document"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center text-slate-400 italic text-[11px] pt-1">
                                No attachments
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                        No notices found matching your search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}