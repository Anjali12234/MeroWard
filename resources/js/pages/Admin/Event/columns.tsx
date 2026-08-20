import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Pencil, Plus, ScanEye, Trash } from "lucide-react";
import { Switch } from "@/components/switch";
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
    },
    
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const event = row.original;
            return (
                <div className="flex gap-2">
                    {/* Edit */}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={uploadMinutePage(event.id).url}>
                            <Plus className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit(event.id).url}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                   
                    <Button variant="outline" size="sm" asChild>
                        <Link href={show(event.id).url}>
                            <ScanEye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this event?")) {
                                router.delete(destroy(event.id), {
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