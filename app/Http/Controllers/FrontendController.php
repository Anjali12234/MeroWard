<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FrontendController extends Controller
{
    public function index()
    {
        $representatives = Employee::query()
        ->where('is_employee', 0)
        ->whereIn('position', [1, 2])
        ->orderBy('position', 'asc') // Sorts position 1 first, then position 2
        ->select('id', 'name', 'designation', 'image', 'phone', 'position')
        ->get();

    return Inertia::render('Welcome', [
        'representatives' => $representatives,
    ]);
    }
  
}
