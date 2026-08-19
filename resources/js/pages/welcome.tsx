import React from 'react';
import { router } from '@inertiajs/react';
import EmployeeRep from '@/components/frontend/EmployeeRep';
import { Employees } from '@/types/Frontend';

interface ServiceItem {
    id: string;
    icon: string;
    title: string;
    description: string;
    route: string;
}

interface WelcomeProps {
    emplyeeReps: Employees[];
}

export default function Welcome({ emplyeeReps }: WelcomeProps) {
    const services: ServiceItem[] = [
        { id: 'citizen-charter', icon: '📄', title: 'Citizen Charter', description: 'Complete detail of the services provided by the ward', route: '/service' },
        { id: 'employee', icon: '📜', title: 'Employee', description: 'View all employee of ward', route: '/employee' },
        { id: 'ward-id', icon: '🆔', title: 'My Ward ID', description: 'Create, view, and update unique ID, large profile area', route: '/ward-id/profile' },
        { id: 'civic', icon: '💬', title: 'Civic Participation', description: 'Meeting check-in form and feedback section, link to trend graph', route: '/civic/participation' },
        { id: 'notices', icon: '🔔', title: 'Ward Notices', description: 'Archived and active, filterable stream', route: '/notice' },
        { id: 'archives', icon: '📁', title: 'Public Archives', description: 'Full-text searchable minutes, development plans', route: '/archives/public-minutes' },
    ];

    const calendarDays = [
        29, 30, 31, 1, 2, 3, 4,
        5, 6, 7, 8, 9, 10, 11,
        12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 1, 2
    ];

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed py-6 px-4"
            style={{
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
                            <button className="bg-white/90 px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 border border-slate-300 shadow-sm">
                                Filter
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-amber-500 text-xl">🔔</span>
                                        <h4 className="font-bold text-slate-800 text-xs">Community Meeting: Mangsi</h4>
                                    </div>
                                    <button className="bg-sky-800 hover:bg-sky-900 text-white text-[11px] px-3 py-1 rounded-md font-semibold transition">
                                        CTA Now
                                    </button>
                                </div>
                                <span className="bg-emerald-500 text-white p-1.5 rounded-full text-xs shadow-sm">💬</span>
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-amber-500 text-xl">🔔</span>
                                        <h4 className="font-bold text-slate-800 text-xs">Monthly Progress Minutes</h4>
                                    </div>
                                    <p className="text-[11px] text-slate-600 font-medium">[Download PDF]</p>
                                </div>
                                <span className="bg-emerald-500 text-white p-1.5 rounded-full text-xs shadow-sm">💬</span>
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
                            <div>
                                <div className="h-32 bg-slate-300 rounded-xl overflow-hidden mb-2 shadow-inner">
                                    <img src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=500&q=80" alt="Project 1" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full bg-slate-300 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-3/4"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 text-right">Progress</p>
                            </div>

                            <div>
                                <div className="h-32 bg-slate-300 rounded-xl overflow-hidden mb-2 shadow-inner">
                                    <img src="https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=500&q=80" alt="Project 2" className="w-full h-full object-cover" />
                                </div>
                                <div className="w-full bg-slate-300 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-2/3"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 text-right">Progress</p>
                            </div>

                            <div className="text-xs text-slate-700 space-y-2 pt-1">
                                <h4 className="font-bold text-slate-800 text-sm">Ward Infrastructure Development</h4>
                                <p className="text-[11px] leading-relaxed text-slate-600">
                                    Road upgrades and community hall construction progress details.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="space-y-5">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 text-sm mb-3">Ward Reps & Events</h3>

                        {/* Dynamic Employee List */}
                        {emplyeeReps.map((employee, idx) => (
                            <EmployeeRep
                                key={idx}
                                title={employee.name}
                                subtitle={employee.designation}
                                image={employee.image}
                            />
                        ))}

                        {/* Calendar */}
                        <div className="border-t border-slate-200 pt-3 mt-4">
                            <h4 className="font-bold text-slate-800 text-xs mb-2">Upcoming Events</h4>
                            <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-slate-500 mb-1">
                                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                            </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}