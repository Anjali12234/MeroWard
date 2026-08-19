import { Head, Link } from "@inertiajs/react";

import { DataTable } from "@/components/data-table";
import useFlashToast from "@/components/useFlashToast";
import Pagination from "@/components/Pagination";

import { PaginatedData } from "@/types";
import { columns } from "./columns";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Event } from "@/types/Admin/Event";
import { create, index } from "@/routes/admin/event";
interface Props {
    event: PaginatedData<Event>; // Changed to "events"
}

export default function EventIndex({ event }: Props) {
    useFlashToast();

    return (
        <>
            <Head title="Event" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Event</h1>
                        <p className="text-muted-foreground">
                            Manage application event and access controls.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create().url} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Event
                        </Link>
                    </Button>
                </div>

                {/* Data Table */}
                <div className="flex-1">
                    <div className="container mx-auto py-6">
                        <DataTable columns={columns} data={event?.data ?? []} />
                        {event?.links && <Pagination links={event.links} />}
                    </div>
                </div>
            </div>
        </>
    );
}