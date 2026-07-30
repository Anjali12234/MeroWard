import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { ScanEye } from "lucide-react";
import { Switch } from "@/components/switch";
import { Citizen } from "@/types/Citizen";
import { status } from "@/routes/admin/citizens";
import { show } from "@/routes/admin/citizen";

export const columns: ColumnDef<Citizen>[] = [
    {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "user_name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone_number",
        header: "Phone Number",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const citizen = row.original;
            const updateToggle = () => {
                router.patch(status(citizen.id), {}, { preserveScroll: true });
            };

            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={Boolean(citizen.status)}
                        onCheckedChange={updateToggle}
                    />
                    <span
                        className={`text-sm font-medium ${
                            citizen.status ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {citizen.status ? "Active" : "Inactive"}
                    </span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const citizen = row.original;
            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={show(citizen.id)}>
                            <ScanEye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            );
        },
    },
];