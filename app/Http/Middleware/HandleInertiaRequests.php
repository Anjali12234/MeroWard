<?php

namespace App\Http\Middleware;

use App\Models\OfficeSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $officeSetting = OfficeSetting::first();
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'officeSetting' => $officeSetting ? [
                'name' => $officeSetting->office_name, // Adjust column name if different
            ] : null,
            'auth' => [
                'user' => $user,
                'citizen' => Auth::guard('citizen')->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

        ];
    }
}
