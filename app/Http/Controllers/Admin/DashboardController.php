<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Employee;
use App\Models\Event;
use App\Models\Notice;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // In DashboardController.php

    public function index()
    {
        $stats = [
            'total_citizens' => Citizen::count(),
            'total_employees' => Employee::count(),
            'total_services' => Service::count(),
            'total_notices' => Notice::count(),
            'total_events' => Event::count(),
            'total_projects' => Project::count(),
        ];

        // Fetches registered citizens count AND includes walk-in guests directly from pivot table
        $recentEvents = Event::withCount([
            'citizens',
            'citizens as total_participants_count' => function ($query) {
                // Counts all rows in citizen_event pivot table including walk-ins where citizen_id is null
                $query->select(\Illuminate\Support\Facades\DB::raw('count(*)'));
            }
        ])
        ->latest()
        ->take(5)
        ->get();

        $recentProjects = Project::latest()->take(5)->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentEvents' => $recentEvents,
            'recentProjects' => $recentProjects,
        ]);
    }
}
