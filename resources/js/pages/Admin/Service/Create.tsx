import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Edit, Clock, DollarSign, FileText, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Service } from "@/types/Admin/Service";
import { edit, index } from "@/routes/admin/service";

interface ServiceShowProps {
    service: Service;
}

export default function ServiceShow({ service }: ServiceShowProps) {
    console.log(service)
    const handleBack = () => window.history.back();

    return (
        <>
            <Head title={`Service - ${service.service_name}`} />

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
                            <h1 className="text-2xl font-bold tracking-tight">
                                Service Details
                            </h1>
                            <p className="text-muted-foreground">
                                View service information
                            </p>
                        </div>
                    </div>

                    <Button asChild>
                        <Link href={edit(service.id).url}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Service Name
                                </h3>

                                <p className="mt-1 text-base font-semibold">
                                    {service.service_name}
                                </p>
                            </div>

                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Time Required
                                </h3>

                                <p className="mt-1">
                                    {service.time}
                                </p>
                            </div>

                            <div>
                                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <DollarSign className="h-4 w-4" />
                                    Price
                                </h3>

                                <p className="mt-1">
                                    Rs. {service.price}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Ward No
                                </h3>

                                <p className="mt-1">
                                    {service.ward_no}
                                </p>
                            </div>

                        </div>

                        <div className="border-t pt-5">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                Required Documents
                            </h3>

                            <p className="mt-2 whitespace-pre-line rounded-md border p-3">
                                {service.required_documents}
                            </p>
                        </div>

                        <div className="border-t pt-5">
                            <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Users className="h-4 w-4" />
                                Responsible Employees
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {service.employees?.length ? (
                                    service.employees.map((employee) => (
                                        <Badge
                                            key={employee.id}
                                            variant="secondary"
                                        >
                                            {employee.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground">
                                        No employee assigned
                                    </span>
                                )}
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ServiceShow.layout = {
    breadcrumbs: [
        {
            title: "Service",
            href: index().url,
        },
        {
            title: "View",
            href: "#",
        },
    ],
};
