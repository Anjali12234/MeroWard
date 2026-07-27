<?php

namespace App\Http\Controllers\Settings;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Province;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $roles = collect(RoleEnum::cases())->map(fn($role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ]);

        // Include database primary keys (id) along with names
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

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'roles' => $roles,
            'locationData' => $locationData,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
