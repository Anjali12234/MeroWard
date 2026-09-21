import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { Pencil, ScanEye, Trash, Mail } from "lucide-react";
import { Project } from "@/types/Admin/Project";
import { SendMailofProject } from "@/routes/admin";
import { destroy, edit, show } from "@/routes/admin/project";

// Helper function to format ISO date string to YYYY-MM-DD
const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    // Extract only the YYYY-MM-DD portion (stripping time/timezone)
    return dateString.split("T")[0];
};

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.getValue("image") as string;
            return image ? (
                <img
                    src={image}
                    alt={row.getValue("title") || "Project Image"}
                    className="h-20 w-20 object-cover rounded"
                />
            ) : (
                <div className="h-20 w-20 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    No Image
                </div>
            );
        },
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        id: "employee",
        header: "Supervisor",
        cell: ({ row }) => {
            const emp = row.original.employee;

            // Resolves full name, fallback name, or N/A
            const supervisorName = emp
                ? emp.name || `${emp.name ?? ""} `.trim()
                : "N/A";

            return <span className="text-slate-700">{supervisorName || "N/A"}</span>;
        },
    },
    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => formatDate(row.getValue("start_date")),
    },
    {
        accessorKey: "finish_date",
        header: "Finish Date",
        cell: ({ row }) => formatDate(row.getValue("finish_date")),
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const project = row.original;

            const handleSendMail = () => {
                if (
                    confirm(
                        "Are you sure you want to send this project to all users of this ward?"
                    )
                ) {
                    router.post(SendMailofProject(project.id).url, {}, {
                        preserveScroll: true,
                        onSuccess: () => alert("Project sent successfully!"),
                        onError: (errors) => {
                            console.error(errors);
                            alert("Failed to send project.");
                        },
                    });
                }
            };

            const handleDelete = () => {
                if (confirm("Are you sure you want to delete this project?")) {
                    router.delete(destroy(project.id).url, {
                        preserveScroll: true,
                    });
                }
            };

            return (
                <div className="flex gap-2">
                    {/* Edit */}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={edit(project.id).url}>
                            <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* View */}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={show(project.id).url}>
                            <ScanEye className="h-4 w-4" />
                        </Link>
                    </Button>

                    {/* Send Mail */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSendMail}
                        title="Send project to all users"
                    >
                        <Mail className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        title="Delete project"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];