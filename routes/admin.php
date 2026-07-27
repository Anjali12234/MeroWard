<?php

use App\Http\Controllers\Admin\OfficeSettingController;
use Illuminate\Support\Facades\Route;



Route::inertia('dashboard', 'dashboard')->name('dashboard');
Route::resource('office-setting', OfficeSettingController::class);
