import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes/admin';

interface DashboardProps {
    stats?: {
        total_citizens: number;
        total_employees: number;
        total_services: number;
        total_notices: number;
        total_events: number;
        total_projects: number;
    };
    recentEvents?: Array<{
        id: number;
        title: string;
        event_date: string;
        status: string;
        total_present_count?: number;
        registered_present_count?: number;
        walkin_present_count?: number;
    }>;
    recentProjects?: Array<{
        id: number;
        title: string;
        status: string;
    }>;
}

export default function Dashboard({ stats, recentEvents = [], recentProjects = [] }: DashboardProps) {
    const cardData = [
        { label: 'Total Citizens', count: stats?.total_citizens ?? 0, icon: '👥', color: 'border-l-sky-500' },
        { label: 'Employees', count: stats?.total_employees ?? 0, icon: '👨‍💼', color: 'border-l-indigo-500' },
        { label: 'Active Services', count: stats?.total_services ?? 0, icon: '📋', color: 'border-l-emerald-500' },
        { label: 'Notices Published', count: stats?.total_notices ?? 0, icon: '📢', color: 'border-l-amber-500' },
        { label: 'Total Events', count: stats?.total_events ?? 0, icon: '📅', color: 'border-l-purple-500' },
        { label: 'Ward Projects', count: stats?.total_projects ?? 0, icon: '🏗️', color: 'border-l-rose-500' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">

                {/* Metric Summary Cards Grid */}
                <div className="grid auto-rows-min gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {cardData.map((item, index) => (
                        <div
                            key={index}
                            className={`flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm border-l-4 ${item.color} dark:border-slate-800 dark:bg-slate-900`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {item.label}
                                </span>
                                <span className="text-xl">{item.icon}</span>
                            </div>
                            <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                                {item.count}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Overview Content Area */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Recent Events Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            📅 Recent Events
                        </h2>
                        {recentEvents.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No recent events recorded.</p>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentEvents.map((event) => {
                                    const totalPresent = event.total_present_count ?? 0;
                                    const registered = event.registered_present_count ?? 0;
                                    const walkin = event.walkin_present_count ?? 0;

                                    return (
                                        <div key={event.id} className="py-3 flex items-center justify-between text-xs">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">{event.title}</p>
                                                <p className="text-slate-400">
                                                    {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>

                                            {/* Attendance Count & Status */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium dark:bg-blue-950 dark:text-blue-300">
                                                        👥 {totalPresent} {totalPresent === 1 ? 'person' : 'people'}
                                                    </span>

                                                    {(registered > 0 || walkin > 0) && (
                                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            ({registered} Reg. | {walkin} Walk-in)
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-medium capitalize dark:bg-slate-800 dark:text-slate-300">
                                                    {event.status?.replace('_', ' ') || 'Upcoming'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Recent Projects Card */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            🏗️ Recent Projects
                        </h2>
                        {recentProjects.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No recent projects recorded.</p>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentProjects.map((project) => (
                                    <div key={project.id} className="py-3 flex items-center justify-between text-xs">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{project.title}</p>
                                        <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-medium capitalize dark:bg-emerald-950 dark:text-emerald-300">
                                            {project.status || 'Ongoing'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard() : '/',
        },
    ],
});