import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Pencil, ScanEye, Trash } from "lucide-react";
import { Switch } from "@/components/switch";
import { Service } from "@/types/Admin/Service";
import { destroy, edit, show } from "@/routes/admin/service";

export const columns: ColumnDef<Service>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => row.index + 1,
    },
   
    {
        accessorKey: "service_name",
        header: "Name",
    },
    {
        accessorKey: "time",
        header: "Time Required",
    },
    {
        accessorKey: "employee_id",
        header: "Responsible Person",
    },
    {
        accessorKey: "price",
        header: "Price Required",
    },
    
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const service = row.original;
            return (
                <div className="flex gap-2">
                    {/* Edit */}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit(service.id).url}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={show(service.id).url}>
                            <ScanEye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this Employee?")) {
                                router.delete(destroy(service.id), {
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