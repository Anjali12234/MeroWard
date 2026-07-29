import React from 'react';
import { Link, router } from '@inertiajs/react';

interface ServiceItem {
    id: string;
    icon: string;
    title: string;
    description: string;
    route: string;
}

export default function Welcome() {
    const services: ServiceItem[] = [
        { id: 'dastur', icon: '📄', title: 'Dastur & Fees', description: 'Rs 100 per sifarish, detailed charts', route: '/services/dastur-fees' },
        { id: 'docs', icon: '📜', title: 'Required Docs', description: 'Checklist & Application templates, full guides', route: '/services/required-documents' },
        { id: 'ward-id', icon: '🆔', title: 'My Ward ID', description: 'Create, view, and update unique ID, large profile area', route: '/ward-id/profile' },
        { id: 'civic', icon: '💬', title: 'Civic Participation', description: 'Meeting check-in form and feedback section, link to trend graph', route: '/civic/participation' },
        { id: 'notices', icon: '🔔', title: 'Ward Notices', description: 'Archived and active, filterable stream', route: '/notices/all' },
        { id: 'archives', icon: '📁', title: 'Public Archives', description: 'Full-text searchable minutes, development plans', route: '/archives/public-minutes' },
    ];

    // Calendar Days Mock (Matches UI)
    const calendarDays = [
        29, 30, 31, 1, 2, 3, 4,
        5, 6, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 1, 2
    ];

    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-fixed py-6 px-4 font-sans text-slate-800"
            style={{ 
                // Uses semi-transparent background over a landscape pattern similar to the mockup
                backgroundImage: `linear-gradient(to bottom, rgba(200, 215, 225, 0.75), rgba(180, 195, 205, 0.85)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')` 
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
                                <div 
                                    key={item.id}
                                    onClick={() => router.visit(item.route)}
                                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-sky-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="text-2xl mb-2">{item.icon}</div>
                                        <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1 leading-snug">{item.description}</p>
                                    </div>
                                    <div className="mt-3 text-[11px] font-semibold text-sky-600 flex items-center">
                                        Open Service <span className="ml-1">→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. LATEST DYNAMIC NOTICES */}
                    <section className="bg-slate-200/70 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Latest Dynamic Notices</h2>
                            <div className="flex items-center space-x-2">
                                <button className="bg-white/90 px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 border border-slate-300 shadow-sm flex items-center">
                                    Filter <span className="ml-1 text-[10px]">∨</span>
                                </button>
                                <span className="text-xs font-medium text-slate-600">Filters</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Notice 1 */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-amber-500 text-xl">🔔</span>
                                        <h4 className="font-bold text-slate-800 text-xs">Community Meeting: Mangsi</h4>
                                    </div>
                                    <p className="text-[11px] text-sky-600 font-medium cursor-pointer hover:underline"></p>
                                    <button className="bg-sky-800 hover:bg-sky-900 text-white text-[11px] px-3 py-1 rounded-md font-semibold transition">
                                        CTA Now
                                    </button>
                                </div>
                                <span className="bg-emerald-500 text-white p-1.5 rounded-full text-xs cursor-pointer shadow-sm">
                                    💬
                                </span>
                            </div>

                            {/* Notice 2 */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-amber-500 text-xl">🔔</span>
                                        <h4 className="font-bold text-slate-800 text-xs">Monthly Progress Minutes</h4>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium">[Download PDF]</p>
                                    <div className="flex items-center space-x-1 text-slate-700 text-xs font-medium">
                                        <span>📄</span>
                                        <span className="text-[11px]">Monthly Progress Minutes [cite:</span>
                                    </div>
                                </div>
                                <span className="bg-emerald-500 text-white p-1.5 rounded-full text-xs cursor-pointer shadow-sm">
                                    💬
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. RECENT PROJECTS */}
                    <section className="bg-slate-200/70 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800">Recent Projects</h2>
                            <div className="flex space-x-1">
                                <button className="bg-white/90 px-2.5 py-0.5 rounded-md border border-slate-300 text-xs font-bold text-slate-600">‹</button>
                                <button className="bg-white/90 px-2.5 py-0.5 rounded-md border border-slate-300 text-xs font-bold text-slate-600">›</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                            {/* Project Image 1 */}
                            <div>
                                <div className="h-32 bg-slate-300 rounded-xl overflow-hidden mb-2 shadow-inner">
                                    <img 
                                        src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=500&q=80" 
                                        alt="Project 1" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="w-full bg-slate-300 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-3/4"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 text-right">Progress</p>
                            </div>

                            {/* Project Image 2 */}
                            <div>
                                <div className="h-32 bg-slate-300 rounded-xl overflow-hidden mb-2 shadow-inner">
                                    <img 
                                        src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=500&q=80" 
                                        alt="Project 2" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="w-full bg-slate-300 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-2/3"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 text-right">Progress</p>
                            </div>

                            {/* Project Details / Text */}
                            <div className="text-xs text-slate-700 space-y-2 pt-1">
                                <h4 className="font-bold text-slate-800 text-sm">Current Ward Reps. | Granlir Repartments <span className="font-normal text-slate-500">(Development) pt. ...</span></h4>
                                <p className="text-[11px] leading-relaxed text-slate-600">
                                    MeroWard Reps expand lved antitosis and Lumbinis Municipality meeting check-in form onts and feedback sechion, link to trend graph ot Expanded....
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* RIGHT SIDEBAR */}
                <div className="space-y-5">
                    
                    {/* WARD REPS & EVENTS SIDEBAR */}
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 text-sm mb-3">Ward Reps & Events Sidebar</h3>

                        {/* Representative 1 */}
                        <div className="flex items-center space-x-3 p-2 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-100 mb-2 transition cursor-pointer">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rep1" alt="Rep" className="w-10 h-10 rounded-full border bg-slate-200" />
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">Curret Ward Reps</h4>
                                <p className="text-[10px] text-slate-500">Curret Ward Reps Expanded</p>
                            </div>
                        </div>

                        {/* Representative 2 */}
                        <div className="flex items-center space-x-3 p-2 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-100 mb-4 transition cursor-pointer">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rep2" alt="Rep" className="w-10 h-10 rounded-full border bg-slate-200" />
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">Granlr Repartments</h4>
                                <p className="text-[10px] text-slate-500">Collevor Repartments Expanded</p>
                            </div>
                        </div>

                        {/* UPCOMING EVENTS CALENDAR */}
                        <div className="border-t border-slate-200 pt-3">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-800 text-xs">Upcoming Events</h4>
                                <div className="space-x-1 text-slate-500 text-xs">
                                    <span>‹</span>
                                    <span>›</span>
                                </div>
                            </div>

                            {/* Calendar Days Header */}
                            <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-500 mb-1">
                                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 text-center text-[10px] text-slate-700 gap-y-1">
                                {calendarDays.map((day, idx) => {
                                    const isHighlight = day === 8 || day === 17;
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`py-0.5 rounded-full mx-auto w-5 h-5 flex items-center justify-center ${
                                                isHighlight ? 'bg-sky-700 text-white font-bold' : ''
                                            }`}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* WARD MAP AREA */}
                        <div className="border-t border-slate-200 pt-4 mt-4">
                            <h4 className="font-bold text-slate-800 text-xs mb-2">Ward 1</h4>
                            <div className="h-40 bg-sky-50 rounded-xl border border-sky-200 relative overflow-hidden flex flex-col justify-between p-2">
                                <div className="text-center mt-4">
                                    <span className="text-red-500 text-xl block">📍</span>
                                    <span className="text-[10px] font-bold text-sky-900 bg-white/80 px-2 py-0.5 rounded shadow-xs">
                                        Ward 1 Service Point
                                    </span>
                                </div>
                                <div className="flex justify-between text-[9px] text-slate-400">
                                    <span>Google Map Data</span>
                                    <span>Terms of Use</span>
                                </div>
                            </div>

                            {/* Bottom LTU Attribution */}
                            <div className="mt-3 text-center text-[10px] text-slate-500 leading-tight border-t pt-2">
                                <p className="font-semibold text-slate-700">Under Guidance of Lumbini Technological University</p>
                                <p>MeroWard © 2083</p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}