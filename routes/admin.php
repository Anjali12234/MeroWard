<?php

use App\Http\Controllers\Admin\CitizenController;
use App\Http\Controllers\Admin\OfficeSettingController;
use Illuminate\Support\Facades\Route;



Route::inertia('dashboard', 'dashboard')->name('dashboard');
Route::resource('office-setting', OfficeSettingController::class);
Route::resource('citizen', CitizenController::class);

Route::patch('citizens/{citizen}/status', [CitizenController::class, 'status'])->name('citizens.status');