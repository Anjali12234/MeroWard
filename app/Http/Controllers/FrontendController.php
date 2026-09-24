<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Event;
use App\Models\Notice;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index()
    {
        $emplyeeReps = Employee::query()
            ->whereIn('position', [1, 2])
            ->orderBy('position', 'asc')
            ->select('id', 'name', 'designation', 'image', 'phone', 'position')
            ->get();

        return Inertia::render('welcome', [
            'emplyeeReps' => $emplyeeReps,
            'events' => Event::all(),
            'notices' => Notice::latest()->take(2)->get(),
            'projects' => Project::latest()->get(), // 2. Send Projects to Inertia
        ]);
    }

    public function projectShow(Project $project): Response
    {
        // Eager load the employee relationship so $project->employee is included in the JSON output
        $project->load('employee');

        return Inertia::render('Frontend/projectShow', [
            'project' => $project,
        ]);
    }
    public function projectList()
    {
        $projects = Project::with('employee')
            ->latest()
            ->get();

        return Inertia::render('Frontend/project', [
            'projects' => $projects,
        ]);
    }

    public function employeeList()
    {
        $employees = Employee::query()
            ->orderBy('position', 'asc')
            ->get();

        return Inertia::render('Frontend/Employee/employee', [
            'employees' => $employees,
        ]);
    }
    public function serviceList()
    {
        $services = Service::with('employees')->latest()->get();
        return Inertia::render('Frontend/service', [
            'services' => $services,
        ]);
    }
    public function noticeList()
    {
        $notices = Notice::latest()->get();
        return Inertia::render('Frontend/notice', [
            'notices' => $notices,
        ]);
    }
    public function noticeShow(Notice $notice): Response
    {
        return Inertia::render('Frontend/noticeShow', [
            'notice' => $notice,
        ]);
    }
    public function eventShow(Event $event): Response
    {
        $citizen = Auth::guard('citizen')->user();
        $isRegistered = false;

        if ($citizen) {
            $isRegistered = $event->citizens()->where('citizen_id', $citizen->id)->exists();
        }

        // Count total online registrations
        $totalRegistered = $event->citizens()->count();

        return Inertia::render('Frontend/eventShow', [
            'event' => $event,
            'isRegistered' => $isRegistered,
            'totalRegistered' => $totalRegistered,
        ]);
    }
    public function eventList()
    {
        $events = Event::latest()->get();
        return Inertia::render('Frontend/event', [
            'events' => $events,
        ]);
    }
    public function toggleEventParticipation(Event $event)
    {
        $citizen = Auth::guard('citizen')->user();

        if (!$citizen) {
            return redirect()->back()->with('error', 'Please login to register for this event.');
        }

        $exists = $event->citizens()->where('citizen_id', $citizen->id)->exists();

        if ($exists) {
            $event->citizens()->detach($citizen->id);
            $message = 'You have cancelled your registration for this event.';
        } else {
            $event->citizens()->attach($citizen->id, [
                'status' => 'registered',
                'registration_type' => 'online',
            ]);
            $message = 'You have successfully registered for this event!';
        }

        return redirect()->back()->with('success', $message);
    }
    
}
