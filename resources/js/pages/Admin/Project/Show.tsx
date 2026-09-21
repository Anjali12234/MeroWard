import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    ArrowLeft, Edit, Image as ImageIcon, Calendar, 
    UserCheck, Clock, AlignLeft, Building2 
} from "lucide-react";
import { Project } from "@/types/Admin/Project";
import { edit, index } from "@/routes/admin/project";

interface ProjectShowProps {
    project: Project;
}

export default function ProjectShow({ project }: ProjectShowProps) {
    const handleBack = () => window.history.back();

    // Helper to format date strings nicely
    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Helper for status badge rendering
    const renderStatusBadge = (status?: string) => {
        switch (status) {
            case 'on_going':
                return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 font-medium text-xs px-2.5 py-0.5">On Going</Badge>;
            case 'completed':
                return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-medium text-xs px-2.5 py-0.5">Completed</Badge>;
            case 'cancelled':
                return <Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 font-medium text-xs px-2.5 py-0.5">Cancelled</Badge>;
            case 'up_coming':
            default:
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 font-medium text-xs px-2.5 py-0.5">Up Coming</Badge>;
        }
    };

    // Safe Image URL Resolver (Prevents string method errors on objects/Files)
    const getImageUrl = (image: unknown): string | null => {
        if (!image) return null;
        const imagePath = typeof image === 'string' ? image : String(image);
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
            return imagePath;
        }
        return `/${imagePath}`;
    };

    const imageUrl = getImageUrl(project?.image);

    return (
        <>
            <Head title={`Project - ${project?.title ?? "Details"}`} />
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
                                <h1 className="text-2xl font-bold tracking-tight">Project Details</h1>
                                {/* Status Badge in Header */}
                                {renderStatusBadge(project?.status)}
                            </div>
                            <p className="text-muted-foreground">
                                View project information and timelines
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {project?.id && (
                            <Button variant="outline" asChild className="flex items-center gap-2">
                                <Link href={edit(project.id).url}>
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Image Card (Styled like Employee Profile Picture) */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-blue-600" />
                                    Project Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6 bg-slate-50/50">
                                {imageUrl ? (
                                    <div className="relative w-full aspect-square max-w-[240px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                                        <img
                                            src={imageUrl}
                                            alt={project.title || "Project Image"}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-square max-w-[240px] rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center gap-2 text-slate-400">
                                        <Building2 className="h-12 w-12 stroke-1" />
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
                                {/* Title */}
                                <div>
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5 text-slate-400" /> Project Title
                                    </h3>
                                    <p className="mt-1 text-base font-semibold text-slate-900">{project.title || "N/A"}</p>
                                </div>

                                {/* Supervisor & Status Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <UserCheck className="h-3.5 w-3.5 text-slate-400" /> Supervisor
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {project?.employee?.name || project?.employee_id || "Unassigned"}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5 text-slate-400" /> Status
                                        </h3>
                                        <div className="mt-1">
                                            {renderStatusBadge(project?.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Start Date & Finish Date Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" /> Start Date
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-slate-800">{formatDate(project.start_date)}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" /> Finish Date
                                        </h3>
                                        <p className="mt-1 text-sm font-medium text-slate-800">{formatDate(project.finish_date)}</p>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="pt-4 border-t border-slate-100">
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                        <AlignLeft className="h-3.5 w-3.5 text-slate-400" /> Overview / Description
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                        {project.description || "No description available for this project."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </>
    );
}

// Persistent Page Layout
ProjectShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: "Project",
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