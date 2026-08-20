import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice } from '@/types/Admin/Notice';
import { Calendar, FileText, Download, ExternalLink, Search, Bell } from 'lucide-react';

interface NoticeIndexProps extends PageProps {
  notices: Notice[];
}

export default function NoticeIndex({ notices = [] }: NoticeIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotices = notices.filter((notice) => {
    const titleEn = notice.title_en?.toLowerCase() || '';
    const titleNe = notice.title_ne?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return titleEn.includes(search) || titleNe.includes(search);
  });

  return (
    <>
      <Head title="Ward Notices & Announcements" />
      
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Bell className="h-6 w-6 text-sky-600" />
                Ward Notices & Announcements
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Stay updated with the latest official publications, circulars, and public updates.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notices..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 border border-transparent"
              />
            </div>
          </div>

          {/* Notices Grid / List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => {
                const docs = Array.isArray(notice.document) ? notice.document : [];
                return (
                  <Card key={notice.id} className="hover:shadow-md transition-shadow border-slate-200">
                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {notice.published_date && (
                            <Badge variant="outline" className="text-sky-700 bg-sky-50 border-sky-200 text-xs gap-1">
                              <Calendar className="h-3 w-3" />
                              {notice.published_date}
                            </Badge>
                          )}
                          {docs.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {docs.length} File(s) Attached
                            </Badge>
                          )}
                        </div>

                        <Link 
                          href={`/notice/${notice.id}`} 
                          className="text-lg font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1"
                        >
                          {notice.title_en || notice.title_ne}
                        </Link>

                        {notice.title_ne && notice.title_en && (
                          <p className="text-xs text-slate-500 font-medium line-clamp-1">
                            {notice.title_ne}
                          </p>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-2 self-start md:self-center">
                        <Button variant="outline" size="sm" asChild className="text-xs">
                          <Link href={`/notice/${notice.id}`}>
                            View Details
                            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-slate-500 text-sm">
                  No notices found matching your criteria.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}