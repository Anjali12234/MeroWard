<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Models\Employee;
use App\Models\OfficeSetting;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use function App\Helpers\deleteFile;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('employees')->latest()->paginate(10);

        return Inertia::render('Admin/Service/Index', [
            'service' => $services
        ]);
    }

    public function create()
    {
        $employees = Employee::all();
        return Inertia::render('Admin/Service/Create', [
            'employees' => $employees
        ]);
    }

    public function store(StoreServiceRequest $request)
    {
        $officeSetting = OfficeSetting::first();
        $validated = $request->validated();
        $employeeIds = $validated['employee_id'];
        unset($validated['employee_id']);
        $service = Service::create($validated + [
            'ward_no' => $officeSetting?->ward,
        ]);

        $service->employees()->sync($employeeIds);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('ServiceCreated.'),
        ]);

        return to_route('admin.service.index');
    }

    public function show(Service $service)
    {
        $service->load('employees');
        return Inertia::render('Admin/Service/Show', [
            'service' => $service
        ]);
    }

    public function edit(Service $service)
    {
        $employees = Employee::all();

        return Inertia::render('Admin/Service/Edit', [
            'employees' => $employees,
            'service' => $service,
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service)
    {
        $validated = $request->validated();
        $serviceData = collect($validated)->except('employee_id')->all();
        $service->update($serviceData);
        if (isset($validated['employee_id'])) {
            $service->employees()->sync($validated['employee_id']);
        } else {
            $service->employees()->detach();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Service Updated.')]);
        return to_route('admin.service.index');
    }

    public function destroy(Service $service)
    {
        $imagePath = $service->getRawOriginal('image');
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
        $service->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Service Deleted.')]);
        return back();
    }
}
