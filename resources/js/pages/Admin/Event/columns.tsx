import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Pencil, Plus, ScanEye, Trash, Users } from "lucide-react";
import { destroy, edit, show } from "@/routes/admin/event";
import { Event } from "@/types/Admin/Event";
import { uploadMinutePage } from "@/routes/admin";

export const columns: ColumnDef<Event>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "event_date",
        header: "Event Date",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span className="capitalize px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                {row.original.status?.replace("_", " ")}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const event = row.original;

            return (
                <div className="flex items-center gap-2">
                    {/* View Attendance / Registered Citizens */}
                    <Button variant="outline" size="sm" asChild title="Attendance Roster & Walk-Ins">
                        <Link href={`/admin/events/${event.id}/attendance`}>
                            <Users className="h-4 w-4 text-sky-600" />
                        </Link>
                    </Button>

                    {/* Upload Minutes - Only visible when event status is 'completed' */}
                    {event.status === "completed" && (
                        <Button variant="outline" size="sm" asChild title="Upload Minutes">
                            <Link href={uploadMinutePage(event.id).url}>
                                <Plus className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}

                    {/* Edit Event */}
                    <Button variant="outline" size="sm" asChild title="Edit Event">
                        <Link href={edit(event.id).url}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* View Event Details */}
                    <Button variant="outline" size="sm" asChild title="View Details">
                        <Link href={show(event.id).url}>
                            <ScanEye className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* Delete Event */}
                    <Button
                        variant="destructive"
                        size="sm"
                        title="Delete Event"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this event?")) {
                                router.delete(destroy(event.id).url ?? destroy(event.id), {
                                    preserveScroll: true,
                                });
                            }
                        }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];