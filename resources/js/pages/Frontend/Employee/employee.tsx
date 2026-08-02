import React, { useState, useMemo } from 'react';
import { Employees } from '@/types/Frontend';

interface EmployeeIndexProps {
    employees: Employees[];
}

export default function EmployeeIndex({ employees = [] }: EmployeeIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('All');

    // Extract unique sections dynamically from the employees array
    const availableSections = useMemo(() => {
        const sections = employees
            .map((emp) => emp.section)
            .filter((section): section is string => Boolean(section));
        return ['All', ...Array.from(new Set(sections))];
    }, [employees]);

    // Safe fallback for ward number display
    const wardNumber = employees.length > 0 && employees[0].ward_no ;

    // Filter logic
    const filteredEmployees = employees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === 'All' || emp.section === selectedDept;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Page Header Banner */}
                <div className="bg-sky-800 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Ward Staff & Official Directory</h1>
                        <p className="text-xs text-sky-200 mt-1">
                            Contact and structural details of personnel serving Ward No. {wardNumber}
                        </p>
                    </div>
                    <span className="bg-sky-700 text-sky-100 px-3 py-1 rounded-full text-xs font-medium">
                        Total Staff: {employees.length}
                    </span>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Search staff by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <span className="text-xs font-semibold text-slate-600">Filter section:</span>
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl focus:outline-none text-slate-700 font-medium cursor-pointer"
                        >
                            {availableSections.map((sec) => (
                                <option key={sec} value={sec}>
                                    {sec === 'All' ? 'All sections' : sec}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Employee Grid */}
                {filteredEmployees.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredEmployees.map((emp, index) => (
                            <div
                                key={emp.id ?? index}
                                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-200"
                            >
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 border-2 border-sky-600 mb-3">
                                    <img
                                        src={emp.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emp.name)}`}
                                        alt={emp.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">{emp.name}</h3>
                                <span className="text-[11px] text-sky-700 font-semibold mt-0.5">
                                    {emp.designation}
                                </span>
                                {emp.section && (
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full mt-2 font-medium">
                                        {emp.section}
                                    </span>
                                )}

                                <div className="mt-4 pt-3 border-t border-slate-100 w-full flex justify-center items-center gap-3 text-slate-500 text-xs">
                                    {emp.phone && (
                                        <a href={`tel:${emp.phone}`} className="hover:text-sky-600 transition flex items-center gap-1" title="Call">
                                            📞 <span>{emp.phone}</span>
                                        </a>
                                    )}
                                    {emp.email && (
                                        <a href={`mailto:${emp.email}`} className="hover:text-sky-600 transition flex items-center gap-1 truncate max-w-[130px]" title={emp.email}>
                                            ✉️ <span className="truncate">{emp.email}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
                        No employees found matching your filter criteria.
                    </div>
                )}
            </div>
        </div>
    );
}