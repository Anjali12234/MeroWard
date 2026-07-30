<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FrontendController;
use App\Models\District;
use App\Models\LocalBody;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [FrontendController::class, 'index'])->name('home');

// routes/web.php or routes/api.php
Route::get('districts/{provinceId}', fn ($id) => District::where('province_id', $id)->get(['id', 'name']));
Route::get('local-bodies/{districtId}', fn ($id) => LocalBody::where('district_id', $id)->get(['id', 'name']));
Route::get('citizenRegister', [AuthController::class, 'citizenRegisterPage'])->name('citizenRegister');
Route::post('citizenRegisterStore', [AuthController::class, 'citizenRegisterStore'])
    ->name('citizen.register.store');
Route::post('citizenLogin', [AuthController::class, 'citizenLogin'])->name('citizenLogin');
Route::get('citizenLogin', [AuthController::class, 'citizenLoginPage'])->name('citizenLoginPage');

Route::post('citizenLogout', [AuthController::class, 'citizenLogout'])->name('citizenLogout');

require __DIR__.'/settings.php';
