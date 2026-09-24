import React, { useState, useMemo } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import EmployeeRep from '@/components/frontend/EmployeeRep';
import { Employees, Event } from '@/types/Frontend';

interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
}

interface OfficeSetting {
  id?: number;
  office_name?: string;
  office_logo?: string;
  office_cover?: string;
  office_email?: string;
  office_phone?: string;
  desc?: string;
  office_address?: string;
  office_google_map?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  province_id?: number;
  district_id?: number;
  local_body_id?: number;
  ward?: string | number;
}

interface Notice {
  id: number | string;
  title_en: string;
  slug: string;
  file_path?: string;
  document?: string | string[];
  created_at?: string;
  category?: string;
}

export interface ProjectItem {
  id: number | string;
  title: string;
  description?: string;
  slug?: string;
  image?: string | string[] | null;
  status?: 'up_coming' | 'on_going' | 'completed' | 'cancelled' | string;
  start_date?: string;
  finish_date?: string;
  employee_id?: number | string;
  employee?: {
    name?: string;
  };
}

interface SharedProps extends PageProps {
  officeSetting?: OfficeSetting | null;
}

interface WelcomeProps {
  employeeReps?: Employees[];
  events?: Event[];
  notices?: Notice[];
  projects?: ProjectItem[];
}

export default function Welcome({
  employeeReps = [],
  events = [],
  notices = [],
  projects = [],
}: WelcomeProps) {
  const { officeSetting } = usePage<SharedProps>().props;
  const [viewDate, setViewDate] = useState(new Date());

  // Project Slider Index State
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const services: ServiceItem[] = [
    { id: 'citizen-charter', icon: '📄', title: 'Citizen Charter', description: 'Complete detail of the services provided by the ward', route: '/service' },
    { id: 'employee', icon: '📜', title: 'Employee', description: 'View all employee of ward', route: '/employee' },
    { id: 'ward-id', icon: '🆔', title: 'My Ward ID', description: 'Create, view, and update unique ID, large profile area', route: 'citizenProfile' },
    { id: 'civic', icon: '💬', title: 'Civic Participation', description: 'Meeting check-in form and feedback section, link to trend graph', route: '/civic/participation' },
    { id: 'notices', icon: '🔔', title: 'Ward Notices', description: 'Archived and active, filterable stream', route: '/notice' },
    { id: 'event', icon: '📁', title: 'Public Events', description: 'Full-text searchable minutes, development plans', route: '/event' },
  ];

  // Robust Google Maps URL Parser / Sanitizer
  const mapUrl = useMemo(() => {
    const rawUrl = officeSetting?.office_google_map;
    if (!rawUrl) return null;

    const cleanUrl = rawUrl.trim();

    // 1. Extract src if raw <iframe> string was saved to DB
    if (cleanUrl.includes('<iframe')) {
      const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
    }

    // 2. Direct embed URLs
    if (cleanUrl.includes('google.com/maps/embed') || cleanUrl.includes('output=embed')) {
      return cleanUrl;
    }

    // 3. Standard Google Maps links converted to embed format
    if (cleanUrl.includes('maps.google.com') || cleanUrl.includes('google.com/maps')) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(cleanUrl)}&output=embed`;
    }

    return cleanUrl;
  }, [officeSetting?.office_google_map]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Slider Navigation Handlers
  const handlePrevProject = () => {
    if (projects.length === 0) return;
    setCurrentProjectIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNextProject = () => {
    if (projects.length === 0) return;
    setCurrentProjectIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const activeProject = projects.length > 0 ? projects[currentProjectIndex] : null;

  // Safe Image Path Resolver Helper
  const getImageUrl = (image?: string | string[] | null): string => {
    const fallbackImage = 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80';
    if (!image) return fallbackImage;

    let imagePath: string = '';

    if (Array.isArray(image) && image.length > 0) {
      imagePath = image[0];
    } else if (typeof image === 'string') {
      try {
        const parsed = JSON.parse(image);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imagePath = parsed[0];
        } else {
          imagePath = image;
        }
      } catch {
        imagePath = image;
      }
    }

    if (typeof imagePath === 'string' && imagePath.trim() !== '') {
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
        return imagePath;
      }
      return `/${imagePath}`;
    }

    return fallbackImage;
  };

  // Status Badge Component Helper
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'on_going':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-amber-200 shadow-sm">On Going</span>;
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-sm">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-rose-200 shadow-sm">Cancelled</span>;
      case 'up_coming':
      default:
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 shadow-sm">Up Coming</span>;
    }
  };

  const calendarGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    const remainingGridCells = 42 - days.length;
    for (let day = 1; day <= remainingGridCells; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewDate]);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getEventForDate = (cellDate: Date) => {
    return events.find((evt) => {
      if (!evt.event_date) return false;
      const evtDate = new Date(evt.event_date);
      return isSameDay(evtDate, cellDate);
    });
  };

  const handleDayClick = (eventItem?: Event) => {
    if (eventItem) {
      router.visit(`/events/${eventItem.slug}`);
    }
  };

  const today = new Date();
  const latestTwoNotices = notices.slice(0, 2);

  const getNoticeFilePath = (notice: Notice): string | null => {
    if (notice.file_path) return notice.file_path;
    if (Array.isArray(notice.document) && notice.document.length > 0) return notice.document[0];
    if (typeof notice.document === 'string') {
      try {
        const parsed = JSON.parse(notice.document);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        return notice.document;
      }
    }
    return null;
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed py-6 px-4"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(200, 215, 225, 0.75), rgba(180, 195, 205, 0.85)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')`,
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT & CENTER MAIN CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. SERVICE DASHBOARD */}
          <section className="bg-slate-200/70 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold text-slate-800">Service Dashboard</h2>
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="🔍 Search for services, fees..."
                  className="w-full pl-4 pr-4 py-2 bg-white rounded-xl border border-slate-300/80 text-xs shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {services.map((item) => (
                <Link
                  key={item.id}
                  href={item.route}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-sky-400 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{item.description}</p>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold text-sky-600 flex items-center">
                    Open Service <span className="ml-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 2. LATEST DYNAMIC NOTICES */}
          <section className="bg-slate-200/70 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Latest Dynamic Notices</h2>
              <Link
                href="/notice"
                className="bg-white/90 hover:bg-white px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 border border-slate-300 shadow-sm transition"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestTwoNotices.length > 0 ? (
                latestTwoNotices.map((notice) => {
                  const downloadUrl = getNoticeFilePath(notice);
                  return (
                    <div
                      key={notice.id}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start"
                    >
                      <div className="space-y-2 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-500 text-xl">🔔</span>
                          <h4 className="font-bold text-slate-800 text-xs line-clamp-2">{notice.title_en}</h4>
                        </div>
                        <Link
                          href={`/notices/${notice.slug || notice.id}`}
                          className="inline-block bg-sky-800 hover:bg-sky-900 text-white text-[11px] px-3 py-1 rounded-md font-semibold transition"
                        >
                          Read More
                        </Link>
                      </div>
                      {downloadUrl && (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-full text-xs shadow-sm transition flex-shrink-0"
                          title="Download Attachment"
                        >
                          📁
                        </a>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-4 text-xs text-slate-500 bg-white/50 rounded-xl">
                  No notices found.
                </div>
              )}
            </div>
          </section>

          {/* 3. RECENT PROJECTS (SLIDER TYPE) */}
          <section className="bg-slate-200/70 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Recent Projects</h2>
                {projects.length > 0 && (
                  <span className="text-xs text-slate-500 bg-white/60 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                    {currentProjectIndex + 1} / {projects.length}
                  </span>
                )}
              </div>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={handlePrevProject}
                  disabled={projects.length <= 1}
                  className="bg-white/90 hover:bg-white active:scale-95 disabled:opacity-40 px-2.5 py-0.5 rounded-md border border-slate-300 text-xs font-bold text-slate-600 transition cursor-pointer"
                  title="Previous Project"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNextProject}
                  disabled={projects.length <= 1}
                  className="bg-white/90 hover:bg-white active:scale-95 disabled:opacity-40 px-2.5 py-0.5 rounded-md border border-slate-300 text-xs font-bold text-slate-600 transition cursor-pointer"
                  title="Next Project"
                >
                  ›
                </button>
              </div>
            </div>

            {activeProject ? (
              <Link
                href={`/projects/${activeProject.slug || activeProject.id}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-200 block group grid grid-cols-1 md:grid-cols-3 gap-5 items-center"
              >
                {/* Image Banner Container */}
                <div className="h-44 bg-slate-100 rounded-xl overflow-hidden border border-slate-200/60 shadow-inner relative">
                  <img
                    src={getImageUrl(activeProject.image)}
                    alt={activeProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    {renderStatusBadge(activeProject.status)}
                  </div>
                </div>

                {/* Details Container */}
                <div className="md:col-span-2 space-y-3 flex flex-col justify-between h-full py-1">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base group-hover:text-sky-700 transition-colors line-clamp-1 mb-1">
                      {activeProject.title}
                    </h3>

                    {activeProject.employee?.name && (
                      <p className="text-xs text-slate-500 font-medium mb-2">
                        Supervisor: <span className="text-slate-700 font-semibold">{activeProject.employee.name}</span>
                      </p>
                    )}

                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {activeProject.description || 'No overview description provided for this project.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="text-[11px] text-slate-500 space-x-3">
                      {activeProject.start_date && (
                        <span>Starts: <strong className="text-slate-700">{activeProject.start_date}</strong></span>
                      )}
                      {activeProject.finish_date && (
                        <span>Ends: <strong className="text-slate-700">{activeProject.finish_date}</strong></span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-sky-600 group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                No recent projects available.
              </div>
            )}
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-5">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Ward Representative</h3>

            {employeeReps.map((employee, idx) => (
              <EmployeeRep
                key={employee.id || idx}
                title={employee.name}
                subtitle={employee.designation}
                image={employee.image}
              />
            ))}

            {/* DYNAMIC CALENDAR */}
            <div className="border-t border-slate-200 pt-3 mt-4">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Public Events</h3>

              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-800 text-xs">
                  {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 text-xs font-bold rounded hover:bg-slate-100 text-slate-600"
                    title="Previous Month"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 text-xs font-bold rounded hover:bg-slate-100 text-slate-600"
                    title="Next Month"
                  >
                    ›
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-500 mb-1">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              <div className="grid grid-cols-7 text-center text-[10px] text-slate-700 gap-y-1">
                {calendarGrid.map((item, idx) => {
                  const eventOnDay = getEventForDate(item.date);
                  const hasEvent = Boolean(eventOnDay);
                  const isToday = isSameDay(item.date, today);

                  return (
                    <div
                      key={idx}
                      onClick={() => handleDayClick(eventOnDay)}
                      title={hasEvent ? `Event: ${eventOnDay?.title}` : undefined}
                      className={`py-0.5 rounded-full mx-auto w-6 h-6 flex items-center justify-center transition-all ${
                        !item.isCurrentMonth
                          ? 'text-slate-300'
                          : hasEvent
                            ? 'bg-sky-700 text-white font-bold cursor-pointer hover:bg-sky-800 hover:scale-110 shadow-sm'
                            : isToday
                              ? 'border border-sky-600 text-sky-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.date.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GOOGLE MAP SECTION */}
            <div className="border-t border-slate-200 pt-3 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  📍 Office Location
                </h4>
                {officeSetting?.office_google_map && (
                  <a
                    href={officeSetting.office_google_map}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-600 hover:underline font-semibold"
                  >
                    Open in Maps ↗
                  </a>
                )}
              </div>

              {mapUrl ? (
                <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location Map"
                  />
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-base mb-1">🗺️</span>
                  <p className="text-[11px] text-slate-500 font-medium">
                    No office location map configured.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}