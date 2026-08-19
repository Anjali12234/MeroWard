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
        $citizens = Citizen::latest()->paginate(10);
        return Inertia::render('Admin/Citizen/Index', [
            'citizen' => $citizens
        ]);
    }
     public function status(Citizen $citizen)
    {
        $citizen->update([
            'status' => !$citizen->status
        ]);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Citizen Updated Successfully.')]);

        
    }
    public function show(Citizen $citizen)
    {
        $citizen->load(['province', 'district', 'localBody']);
        return Inertia::render('Admin/Citizen/Show', [
            'citizen' => $citizen,
        ]);
    }
}
