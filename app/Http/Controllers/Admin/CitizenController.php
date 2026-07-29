<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CitizenController extends Controller
{
    public function index()
    {
        $citizens = Citizen::all();
        return Inertia::render('Admin/Citizen/Index', [
            'citizen' => $citizens
        ]);
    }
     public function status(Citizen $citizen)
    {
        $citizen->update([
            'status' => !$citizen->status
        ]);
    }
    public function show(Citizen $citizen)
    {
        return Inertia::render('Admin/citizen/Show', [
            'citizen' => $citizen,
        ]);
    }
}
