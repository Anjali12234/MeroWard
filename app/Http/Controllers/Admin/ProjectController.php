<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Mail\SendNoticeToAllUser;
use App\Models\Citizen;
use App\Models\Employee;
use App\Models\OfficeSetting;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('employee')->latest()->paginate(10);

        return Inertia::render('Admin/Project/Index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Project/Create', [
            'statuses' => $this->getStatusOptions(),
            'employees' => $this->getEmployeeOptions(),
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        $officeSetting = OfficeSetting::first();

        // Handles file upload handling through request validation
        Project::create($request->validated() + [
            'ward_id' => $officeSetting?->ward,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Project Created Successfully.')]);
        
        return to_route('admin.project.index');
    }

    public function show(Project $project)
    {
        return Inertia::render('Admin/Project/Show', [
            'project' => $project->load('employee'),
        ]);
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Project/Edit', [
            'project' => $project->load('employee'),
            'statuses' => $this->getStatusOptions(),
            'employees' => $this->getEmployeeOptions(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $officeSetting = OfficeSetting::first();

        $project->update($request->validated() + [
            'ward_id' => $officeSetting?->ward,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Project Updated Successfully.')]);

        return to_route('admin.project.index');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return to_route('admin.project.index')->with('success', 'Project Deleted Successfully');
    }

    public function toggleStatus(Project $project)
    {
        $project->update([
            'status' => !$project->status,
        ]);

        return to_route('admin.project.index')->with('success', 'Project Status Updated Successfully');
    }

    public function sendNoticeToAll(Project $project)
    {
        $users = Citizen::where('ward', $project->ward_id)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->get();

        $sent = 0;
        $failed = 0;

        foreach ($users as $user) {
            try {
                Mail::to($user->email)
                    ->send(new SendNoticeToAllUser($project));

                $sent++;

                Log::info('Project email sent', [
                    'citizen_id' => $user->id,
                    'email' => $user->email,
                    'ward' => $user->ward,
                ]);
            } catch (\Throwable $e) {
                $failed++;

                Log::error('Project email failed', [
                    'citizen_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return back()->with(
            'success',
            "Notice sent. Sent: {$sent}, Failed: {$failed}."
        );
    }

    /**
     * Helper to get dropdown status options.
     */
    private function getStatusOptions()
    {
        return collect(EventStatus::cases())->map(fn($status) => [
            'value' => $status->value,
            'label' => $status->label(),
        ]);
    }

    /**
     * Helper to get dropdown employee options.
     */
    private function getEmployeeOptions()
    {
        return Employee::all()->map(fn($employee) => [
            'value' => $employee->id,
            'label' => $employee->name ?? trim(($employee->first_name ?? '') . ' ' . ($employee->last_name ?? '')),
        ]);
    }
}