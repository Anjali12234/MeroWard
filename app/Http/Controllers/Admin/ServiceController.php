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
        $services = Service::latest()->paginate(10);
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

        $service = Service::create([
            'service_name'       => $validated['service_name'],
            'required_documents' => $validated['required_documents'],
            'time'               => $validated['time'],
            'price'              => $validated['price'],
            'ward_no'            => $officeSetting?->ward,
        ]);

        // Attach selected employees to pivot table
        $service->employees()->sync($validated['employee_ids']);

        return to_route('admin.service.index')->with('success', 'Service Created Successfully');
    }
    public function show(Service $service)
    {
        return Inertia::render('Admin/Service/Show', [
            'service' => $service,
        ]);
    }
    public function edit(Service $service)
    {
        $employees = Employee::all();

        return Inertia::render('Admin/Service/Create', [
            'employees' => $employees,
            'service'   => $service->load('employees'), // Eager load pivot relationship
        ]);
    }
    public function update(Request $request, Service $service)
    {
        // Make sure you update $service, not call Service::create()
        $service->update($request->validated());
        $service->employees()->sync($request->employee_ids);

        return redirect()->back();
    }
    public function destroy(Service $service)
    {
        $imagePath = $service->getRawOriginal('image');
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
        $service->delete();
        return to_route('admin.service.index')->with('success', 'Service Deleted Successfully');
    }
}
