import { Head, Link } from "@inertiajs/react";

import { DataTable } from "@/components/data-table";
import useFlashToast from "@/components/useFlashToast";
import Pagination from "@/components/Pagination";

import { PaginatedData } from "@/types";
import { columns } from "./columns";
import AppLayout from "@/layouts/app-layout";
import { Employee } from "@/types/Admin/Employee";
import { create, index } from "@/routes/admin/employee";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
    employee: PaginatedData<Employee>;
}

export default function EmployeeIndex({ employee }: Props) {
    useFlashToast();

    return (
        <>
            <Head title="Employee" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Employee</h1>
                        <p className="text-muted-foreground">
                            Manage application employee and access controls.
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
                        <DataTable columns={columns} data={employee?.data ?? []} />
                        {employee?.links && <Pagination links={employee.links} />}
                    </div>
                </div>
            </div>
        </>
    );
}

// Attach persistent layout and breadcrumbs identically to Dashboard
EmployeeIndex.layout = (page: React.ReactNode) => (
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