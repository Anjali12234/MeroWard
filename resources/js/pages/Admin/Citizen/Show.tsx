import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { Citizen } from "@/types/Citizen";
import { index, edit } from "@/routes/admin/citizen";

interface CitizenShowProps {
    citizen: Citizen;
}

export default function CitizenShow({ citizen }: CitizenShowProps) {
    const handleBack = () => window.history.back();

    return (
        <>
            <Head title={`Citizen - ${citizen?.user_name ?? "Details"}`} />
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
                            <h1 className="text-2xl font-bold tracking-tight">Citizen Details</h1>
                            <p className="text-muted-foreground">
                                View citizen information
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="flex items-center gap-2">
                            <Link href={edit(citizen.id).url}>
                                <Edit className="h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                                        <p className="mt-1 text-base font-semibold">{citizen.user_name}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                        {citizen.email ? (
                                            <Badge className="mt-1 bg-blue-600 text-sm">{citizen.email}</Badge>
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">N/A</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                                        <p className="mt-1 font-mono text-sm">{citizen.phone_number || "N/A"}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">WhatsApp Number</h3>
                                        <p className="mt-1 font-mono text-sm">{citizen.whatsapp_number || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Location Details Grid */}
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-4 border-t">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Province</h3>
                                        <p className="mt-1 text-sm font-medium">
                                            {citizen.province?.name ?? "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">District</h3>
                                        <p className="mt-1 text-sm font-medium">
                                            {citizen.district?.name ?? "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Local Body</h3>
                                        <p className="mt-1 text-sm font-medium">
                                            {citizen.local_body?.name ?? citizen.localBody?.name ?? "N/A"}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Ward</h3>
                                        <p className="mt-1 text-sm font-medium">
                                            {citizen.ward ?? "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

// Attach persistent layout and breadcrumbs identically to CitizenIndex
CitizenShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: "Citizen",
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