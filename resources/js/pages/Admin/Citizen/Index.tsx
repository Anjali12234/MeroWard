import { Head } from "@inertiajs/react";

import { DataTable } from "@/components/data-table";
import useFlashToast from "@/components/useFlashToast";
import Pagination from "@/components/Pagination";

import { index } from "@/routes/admin/citizen";
import { Citizen } from "@/types/Citizen";
import { PaginatedData } from "@/types";
import { columns } from "./columns";
import AppLayout from "@/layouts/app-layout";

interface Props {
    citizen: PaginatedData<Citizen>;
}

export default function CitizenIndex({ citizen }: Props) {
    useFlashToast();

    return (
        <>
            <Head title="Citizen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Citizen</h1>
                        <p className="text-muted-foreground">
                            Manage application citizens and access controls.
                        </p>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex-1">
                    <div className="container mx-auto py-6">
                        <DataTable columns={columns} data={citizen?.data ?? []} />
                        {citizen?.links && <Pagination links={citizen.links} />}
                    </div>
                </div>
            </div>
        </>
    );
}

// Attach persistent layout and breadcrumbs identically to Dashboard
CitizenIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Citizen',
                href: index().url,
            },
        ]}
    >
        {page}
    </AppLayout>
);