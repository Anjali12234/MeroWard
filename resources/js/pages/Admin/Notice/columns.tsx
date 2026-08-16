import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Pencil, ScanEye, Trash, Mail } from "lucide-react";
import { Notice } from "@/types/Admin/Notice";
import { destroy, edit, show, sendMailToAll } from "@/routes/admin/notice";
import { SendMailToUser } from "@/routes/admin";

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

            const handleSendMail = () => {
                if (
                    confirm(
                        "Are you sure you want to send this notice to all users of this ward?"
                    )
                ) {
                    router.post(SendMailToUser(notice.id).url, {}, {
                        preserveScroll: true,
                        onSuccess: () => {
                            alert("Notice sent successfully!");
                        },
                        onError: (errors) => {
                            console.error(errors);
                            alert("Failed to send notice.");
                        },
                    });
                }
            };

            const handleDelete = () => {
                if (
                    confirm(
                        "Are you sure you want to delete this Notice?"
                    )
                ) {
                    router.delete(destroy(notice.id), {
                        preserveScroll: true,
                    });
                }
            };

            return (
                <div className="flex gap-2">
                    {/* Edit */}
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={edit(notice.id).url}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* View */}
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href={show(notice.id).url}>
                            <ScanEye className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* Send Mail */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSendMail}
                        title="Send notice to all users"
                    >
                        <Mail className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        title="Delete notice"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
