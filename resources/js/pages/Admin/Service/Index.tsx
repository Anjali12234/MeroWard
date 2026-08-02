import { Head, Link } from "@inertiajs/react";

import { DataTable } from "@/components/data-table";
import useFlashToast from "@/components/useFlashToast";
import Pagination from "@/components/Pagination";

import { PaginatedData } from "@/types";
import { columns } from "./columns";
import AppLayout from "@/layouts/app-layout";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Service } from "@/types/Admin/Service";
import { create, index } from "@/routes/admin/service";

interface Props {
    service: PaginatedData<Service>;
}

export default function ServiceIndex({ service }: Props) {
    useFlashToast();

    return (
        <>
            <Head title="Service" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Service</h1>
                        <p className="text-muted-foreground">
                            Manage application service and access controls.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create().url} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Employee
                        </Link>
                    </Button>
                </div>

                {/* Data Table */}
                <div className="flex-1">
                    <div className="container mx-auto py-6">
                        <DataTable columns={columns} data={service?.data ?? []} />
                        {service?.links && <Pagination links={service.links} />}
                    </div>
                </div>
            </div>
        </>
    );
}

// Attach persistent layout and breadcrumbs identically to Dashboard
ServiceIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Employee',
                href: index().url,
            },
        ]}
    >
        {page}
    </AppLayout>
);