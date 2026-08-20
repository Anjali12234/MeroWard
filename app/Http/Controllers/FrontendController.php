<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Event;
use App\Models\Notice;
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
            ->orderBy('position', 'asc') // Sorts position 1 first, then position 2
            ->select('id', 'name', 'designation', 'image', 'phone', 'position')
            ->get();

        return Inertia::render('welcome', [
            'emplyeeReps' => $emplyeeReps,
            'events' => Event::all(),
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
        return Inertia::render('Frontend/service',[
            'services' => $services,
        ]);
    }
    public function noticeList()
    {
        $notices = Notice::latest()->get();
        return Inertia::render('Frontend/notice',[
            'notices' => $notices,
        ]);
    }
    public function eventShow(Event $event): Response
    {
        return Inertia::render('Frontend/eventShow', [
            'event' => $event,
        ]);
    }
}
