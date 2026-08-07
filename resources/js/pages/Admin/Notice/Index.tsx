import { Head, Link } from "@inertiajs/react";

import { DataTable } from "@/components/data-table";
import useFlashToast from "@/components/useFlashToast";
import Pagination from "@/components/Pagination";

import { PaginatedData } from "@/types";
import { columns } from "./columns";
import AppLayout from "@/layouts/app-layout";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { create, index } from "@/routes/admin/notice";
import { Notice } from "@/types/Admin/Notice";

interface Props {
    notices: PaginatedData<Notice>;
}

export default function NoticeIndex({ notices }: Props) {
    useFlashToast();

    return (
        <>
            <Head title="Notice" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Notice</h1>
                        <p className="text-muted-foreground">
                            Manage notice and access controls.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create().url} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Notice
                        </Link>
                    </Button>
                </div>

                {/* Data Table */}
                <div className="flex-1">
                    <div className="container mx-auto py-6">
                        <DataTable columns={columns} data={notices?.data ?? []} />
                        {notices?.links && <Pagination links={notices.links} />}
                    </div>
                </div>
            </div>
        </>
    );
}

// Attach persistent layout and breadcrumbs identically to Dashboard
NoticeIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Notice',
                href: index().url,
            },
        ]}
    >
        {page}
    </AppLayout>
);