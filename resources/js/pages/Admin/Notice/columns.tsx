import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Pencil, ScanEye, Trash } from "lucide-react";
import { Switch } from "@/components/switch";
import { Notice } from "@/types/Admin/Notice";
import { destroy, edit, show } from "@/routes/admin/notice";

export const columns: ColumnDef<Notice>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => row.index + 1,
    },
   
    {
        accessorKey: "title_en",
        header: "Title",
    },
    {
        accessorKey: "published_date",
        header: "Published Date",
    },
  
    
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const notice = row.original;
            return (
                <div className="flex gap-2">
                    {/* Edit */}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit(notice.id).url}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={show(notice.id).url}>
                            <ScanEye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this Notice?")) {
                                router.delete(destroy(notice.id), {
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