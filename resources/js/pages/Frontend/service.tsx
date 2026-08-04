import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Search, FileText, User, Clock, Banknote } from 'lucide-react';

export interface Employee {
    id: number;
    name: string;
    designation?: string;
    phone?: string;
    section?: string;
}

export interface Service {
    id: number;
    service_name: string;
    time: string;
    price: string;
    required_documents?: string;
    ward_no?: number;
    employees?: Employee[];
}

interface ServiceIndexProps {
    services: Service[];
}

export default function ServiceIndex({ services = [] }: ServiceIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const wardNumber = services.length > 0 ? services[0].ward_no : null;

    const filteredServices = useMemo(() => {
        return services.filter((srv) => {
            const matchesName = srv.service_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDocs = srv.required_documents?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEmployee = srv.employees?.some((emp) =>
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.section?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return matchesName || matchesDocs || matchesEmployee;
        });
    }, [services, searchTerm]);

    return (
        <>
            <Head title="Ward Services Directory" />
            <div className="min-h-screen bg-slate-100 py-8 px-4">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Header Banner */}
                    <div className="bg-sky-800 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Ward Services & Information Directory</h1>
                            <p className="text-xs text-sky-200 mt-1">
                                Citizen Charter for Ward No. {wardNumber || 'N/A'}
                            </p>
                        </div>
                        <span className="bg-sky-700 text-sky-100 px-3 py-1 rounded-full text-xs font-medium">
                            Total Services: {services.length}
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search services, documents, or officers..."
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
                                        <th className="py-3.5 px-4 w-1/5 border-r border-sky-800">Service / Facility Name</th>
                                        <th className="py-3.5 px-4 w-2/5 border-r border-sky-800">
                                            <div className="flex items-center gap-1.5">
                                                <FileText className="w-3.5 h-3.5" /> Required Documents
                                            </div>
                                        </th>
                                        <th className="py-3.5 px-4 border-r border-sky-800">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> Responsible Officer
                                            </div>
                                        </th>
                                        <th className="py-3.5 px-4 border-r border-sky-800">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" /> Time Required
                                            </div>
                                        </th>
                                        <th className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <Banknote className="w-3.5 h-3.5" /> Fee / Cost
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                                    {filteredServices.length > 0 ? (
                                        filteredServices.map((service, index) => (
                                            <tr key={service.id} className="hover:bg-slate-50/80 transition-colors">
                                                {/* S.N. */}
                                                <td className="py-4 px-4 text-center font-medium text-slate-500 align-top border-r border-slate-100">
                                                    {index + 1}
                                                </td>

                                                {/* Service Name */}
                                                <td className="py-4 px-4 font-bold text-slate-900 align-top border-r border-slate-100">
                                                    {service.service_name}
                                                </td>

                                                {/* Required Documents */}
                                                <td className="py-4 px-4 align-top border-r border-slate-100 whitespace-pre-line leading-relaxed">
                                                    {service.required_documents || <span className="text-slate-400 italic">None specified</span>}
                                                </td>

                                                {/* Responsible Officers */}
                                                <td className="py-4 px-4 align-top border-r border-slate-100">
                                                    {service.employees && service.employees.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {service.employees.map((emp) => (
                                                                <div key={emp.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                                                                    <div className="font-semibold text-slate-800">{emp.name}</div>
                                                                    {emp.designation && <div className="text-[11px] text-slate-500">{emp.designation}</div>}
                                                                    {emp.section && <div className="text-[10px] text-sky-700 font-medium">{emp.section}</div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Not assigned</span>
                                                    )}
                                                </td>

                                                {/* Time Required */}
                                                <td className="py-4 px-4 align-top font-medium text-slate-800 border-r border-slate-100 whitespace-pre-line">
                                                    {service.time}
                                                </td>

                                                {/* Fee / Cost */}
                                                <td className="py-4 px-4 align-top font-medium text-emerald-700 whitespace-pre-line">
                                                    {service.price}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                                                No services found matching your query.
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