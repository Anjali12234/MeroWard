<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Http\Requests\Employee\UpdateEmployeeRequest;
use App\Models\Employee;
use App\Models\OfficeSetting;
use Illuminate\Http\Request;
use Illuminate\Session\Store;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use function App\Helpers\deleteFile;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::latest()->paginate(10);
        return Inertia::render('Admin/Employee/Index', [
            'employee' => $employees
        ]);
    }
    public function create()
    {
        return Inertia::render('Admin/Employee/Create');
    }
    public function store(StoreEmployeeRequest $request)
    {
        $officeSetting = OfficeSetting::first();

        Employee::create($request->validated() + [
            'ward_no' => $officeSetting?->ward, // Safely gets ward_id or null if no record exists
        ]);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee Created Successfully.')]);

        return to_route('admin.employee.index');
    }
     public function show(Employee $employee)
    {
        return Inertia::render('Admin/Employee/Show', [
            'employee' => $employee,
        ]);
    }
    public function edit(Employee $employee)
    {
        return Inertia::render('Admin/Employee/Edit',[
            'employee' => $employee
        ]);
    }
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $officeSetting = OfficeSetting::first();

         $data = $request->validated() + ['ward_no' => $officeSetting?->ward,];
        // if you want old image deleted when new one is uploaded
        if ($request->hasFile('image')) {
            deleteFile($employee->getRawOriginal('image'));
        }
        $employee->update($data);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee Created Successfully.')]);

        return to_route('admin.employee.index');
    }
     public function destroy(Employee $employee)
    {
        $imagePath = $employee->getRawOriginal('image');
        if ($imagePath && Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->delete($imagePath);
        }
        $employee->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Employee Deleted Successfully')]);

        return to_route('admin.employee.index');
    }
}
