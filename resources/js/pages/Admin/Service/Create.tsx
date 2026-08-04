

import { Head, Form } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import InputError from "@/components/input-error"
import { ArrowLeftIcon } from "lucide-react"
import { Employee } from "@/types/Admin/Employee"
import { Service } from "@/types/Admin/Service"
import { index, store, update } from "@/routes/admin/service"


const handleBack = () => {
    window.history.back()
}
interface EmployeeProps {
    employees: Employee[];

}
export default function CreateService({ employees }: EmployeeProps) {
    return (
        <>

            <Head title="Create Service" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 ">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBack}

                            className="flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Create Service</h1>
                            <p className="text-muted-foreground">
                                Create New Service.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form
                                action={store().url}
                                method="POST"
                                className="space-y-6"
                                encType="multipart/form-data"
                            >
                                {({ errors }) => (
                                    <>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="employee_id">
                                                    Employees <span className="text-red-500">*</span>
                                                </Label>

                                                <select
                                                    id="employee_id"
                                                    name="employee_id[]"
                                                    multiple
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                >
                                                    {employees.map((employee) => (
                                                        <option key={employee.id} value={employee.id}>
                                                            {employee.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <InputError message={errors.employee_id} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="service_name">Service Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="service_name"
                                                    name="service_name"
                                                    type="text"
                                                    placeholder="service name"
                                                />
                                                <InputError message={errors.service_name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="time">time <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="time"
                                                    name="time"
                                                    type="text"
                                                    placeholder="1 hour/same day"
                                                />
                                                <InputError message={errors.time} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="price"
                                                    name="price"
                                                    type="text"
                                                    placeholder="price"
                                                />
                                                <InputError message={errors.price} />
                                            </div>


                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="required_documents">Required Documents</Label>
                                            <Textarea
                                                id="required_documents"
                                                name="required_documents"
                                                placeholder="required documents"
                                                rows={6}
                                            />
                                            <InputError message={errors.description} />
                                        </div>


                                        {/* Buttons */}
                                        <div className="flex gap-2 pt-4">
                                            <Button type="submit">Save</Button>
                                            <Button type="button" variant="outline" onClick={handleBack}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )


}


CreateService.layout = {
    breadcrumbs: [
        {
            title: 'Service',
            href: index().url,
        },
    ],
};
