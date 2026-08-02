import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Image as ImageIcon, Mail, Phone, User, ShieldCheck, UserCheck } from "lucide-react";
import { Employee } from "@/types/Admin/Employee";
import { edit, index } from "@/routes/admin/employee";

interface EmployeeShowProps {
    employee: Employee;
}

export default function EmployeeShow({ employee }: EmployeeShowProps) {
    const handleBack = () => window.history.back();

    // Helper to determine status display
    const isEmp = Number(employee.is_employee) === 1;
    const roleLabel = isEmp ? "Employee" : "Janpratinidhi";

    return (
        <>
            <Head title={`Employee - ${employee?.name ?? "Details"}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBack}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
                                {/* Status Badge in Header */}
                                <Badge 
                                    className={
                                        isEmp 
                                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium text-xs px-2.5 py-0.5" 
                                            : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium text-xs px-2.5 py-0.5"
                                    }
                                >
                                    {roleLabel}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                View employee information
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="flex items-center gap-2">
                            <Link href={edit(employee.id).url}>
                                <Edit className="h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Image Card */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-blue-600" />
                                    Profile Picture
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6 bg-slate-50/50">
                                {employee.image ? (
                                    <div className="relative w-full aspect-square max-w-[240px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                                        <img
                                            src={employee.image}
                                            alt={employee.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-square max-w-[240px] rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-2 text-slate-400">
                                        <User className="h-12 w-12 stroke-1" />
                                        <span className="text-xs font-medium text-slate-500">No Image Available</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Main Details */}
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-slate-800">Information</CardTitle>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-slate-400" /> Full Name
                                        </h3>
                                        <p className="mt-1 text-base font-semibold text-slate-900">{employee.name || "N/A"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
                                        </h3>
                                        {employee.email ? (
                                            <Badge className="mt-1 bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 border-blue-200 font-normal text-sm px-2.5 py-0.5">
                                                {employee.email}
                                            </Badge>
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">N/A</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-slate-400" /> Phone Number
                                        </h3>
                                        <p className="mt-1 font-mono text-sm text-slate-800">{employee.phone || "N/A"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Designation</h3>
                                        <p className="mt-1 text-sm font-medium text-slate-800">{employee.designation || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Type (Is Employee) & Section Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            {isEmp ? <UserCheck className="h-3.5 w-3.5 text-slate-400" /> : <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />} Category / Type
                                        </h3>
                                        <p className="mt-1 text-sm font-medium">
                                            <span className={isEmp ? "text-emerald-700 font-semibold" : "text-amber-700 font-semibold"}>
                                                {roleLabel}
                                            </span>
                                        </p>
                                    </div>

                                    {employee.section && (
                                        <div>
                                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Section</h3>
                                            <p className="mt-1 text-sm font-medium text-slate-800">{employee.section}</p>
                                        </div>
                                    )}
                                </div>

                                {employee.position !== undefined && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                        <div>
                                            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Position Order</h3>
                                            <p className="mt-1 text-sm font-medium text-slate-800">{employee.position}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </>
    );
}

// Attach persistent layout and breadcrumbs identically to CitizenIndex
EmployeeShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: "Employee",
                href: index().url,
            },
            {
                title: "View",
                href: "#",
            },
        ]}
    >
        {page}
    </AppLayout>
);