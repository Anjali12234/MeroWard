import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import { DataTable } from '@/components/data-table'; // Assuming this component is enhanced to handle server-side pagination
import useFlashToast from '@/components/useFlashToast';

import { index } from '@/routes/admin/citizen';
import { Citizen } from '@/types/Citizen';
import Pagination from '@/components/Pagination';
import { BreadcrumbItem } from '@/types';
import{PaginatedData} from '@/types';
import { columns } from './columns';


interface Props {
    citizen: PaginatedData<Citizen>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Citizen',
        href: index().url,
    },
];

export default function CategoryIndex({ citizen }: Props) {
    useFlashToast()
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Citizen" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Citizen</h1>
                        <p className="text-muted-foreground">
                            Manage application citizen and access controls.
                        </p>
                    </div>  
                    
                </div>

                {/* Data Table */}
                <div className="flex-1">
                    <div className="container mx-auto py-10">
                        {/* Pass the entire paginated citizen object to DataTable */}
                        <DataTable columns={columns} data={citizen.data} />
                        <Pagination links={citizen.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
