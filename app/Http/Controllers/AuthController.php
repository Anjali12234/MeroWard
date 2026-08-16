<?php

namespace App\Http\Controllers;

use App\Http\Requests\Citizen\CitizenRequest;
use App\Models\Citizen;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Laravel\Fortify\Http\Requests\LoginRequest;

class AuthController extends Controller
{
    public function citizenRegisterPage()
    {
        $locationData = Province::with(['districts.localBodies'])->get()->map(function ($province) {
            return [
                'id' => $province->id,
                'name' => $province->name,
                'districts' => $province->districts->map(function ($district) {
                    return [
                        'id' => $district->id,
                        'name' => $district->name,
                        'local_bodies' => $district->localBodies->map(function ($lb) {
                            return [
                                'id' => $lb->id,
                                'name' => $lb->name,
                                'total_wards' => $lb->total_wards,
                            ];
                        }),
                    ];
                }),
            ];
        });
        return Inertia::render('Frontend/CitizenAuth/Register', [
            'locationData' => $locationData
        ]);
    }

    public function citizenRegisterStore(CitizenRequest $request)
    {
        $citizen = Citizen::create($request->validated());

        Auth::guard('citizen')->login($citizen);

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Registered Successfully.',
        ]);

        return to_route('home');
    }

    public function citizenLoginPage()
    {
        return Inertia::render('Frontend/CitizenAuth/Login');
    }

    // In App\Http\Controllers\AuthController.php

    public function citizenLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (Auth::guard('citizen')->attempt($credentials, $request->remember)) {
            $request->session()->regenerate();
            return redirect()->intended('/');  // Redirects to Home page
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function citizenLogout(Request $request)
    {
        Auth::guard('citizen')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Logout Successful.',
        ]);

        return to_route('home');
    }
}
