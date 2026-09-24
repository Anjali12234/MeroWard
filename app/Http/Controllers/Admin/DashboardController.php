<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Employee;
use App\Models\Event;
use App\Models\Notice;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_citizens'  => Citizen::count(),
            'total_employees' => Employee::count(),
            'total_services'  => Service::count(),
            'total_notices'   => Notice::count(),
            'total_events'    => Event::count(),
            'total_projects'  => Project::count(),
        ];

        // Fetch recent events with raw subqueries looking for status = 'attended'
        $recentEvents = Event::select('events.*')
            ->selectSub(function ($query) {
                $query->from('citizen_event')
                    ->whereColumn('citizen_event.event_id', 'events.id')
                    ->where('status', 'attended')
                    ->selectRaw('count(*)');
            }, 'total_present_count')
            ->selectSub(function ($query) {
                $query->from('citizen_event')
                    ->whereColumn('citizen_event.event_id', 'events.id')
                    ->where('status', 'attended')
                    ->whereNotNull('citizen_id')
                    ->selectRaw('count(*)');
            }, 'registered_present_count')
            ->selectSub(function ($query) {
                $query->from('citizen_event')
                    ->whereColumn('citizen_event.event_id', 'events.id')
                    ->where('status', 'attended')
                    ->whereNull('citizen_id')
                    ->selectRaw('count(*)');
            }, 'walkin_present_count')
            ->latest()
            ->take(5)
            ->get();

        $recentProjects = Project::latest()->take(5)->get();

        return Inertia::render('dashboard', [
            'stats'          => $stats,
            'recentEvents'   => $recentEvents,
            'recentProjects' => $recentProjects,
        ]);
    }
}