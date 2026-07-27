<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Symfony\Component\HttpFoundation\Response;

class AutoPermissionMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            abort(401, 'Unauthenticated.');
        }

        // Get the current route's name (e.g., 'officeSetting.index', 'officeSetting.create')
        $routeName = $request->route()?->getName();

        if ($routeName) {
            // 1. Automatically create the permission in the database if it doesn't exist yet
            $permission = Permission::firstOrCreate([
                'name'       => $routeName,
                'guard_name' => 'web', // Adjust guard name if using 'api'
            ]);

            // Optional: Grant Super-Admin full access bypass
            if ($user->hasRole('super-admin')) {
                return $next($request);
            }

            // 2. Check if the user has permission to access this route
            if (!$user->hasPermissionTo($routeName)) {
                abort(403, "Access denied. Required permission: {$routeName}");
            }
        }

        return $next($request);
    }
}
