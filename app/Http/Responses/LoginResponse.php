<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
   
        public function toResponse($request)
    {
       $user = Auth::user();

        if ($user) {
            return redirect()->intended('admin/dashboard');
        }

        return redirect()->intended('/');
    }
}
