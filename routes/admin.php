<?php

use App\Http\Controllers\Admin\CitizenController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\OfficeSettingController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\NoticeController;
use Illuminate\Support\Facades\Route;

Route::inertia('dashboard', 'dashboard')->name('dashboard');
Route::resource('office-setting', OfficeSettingController::class);
Route::resource('citizen', CitizenController::class);
Route::patch('citizens/{citizen}/status', [CitizenController::class, 'status'])->name('citizens.status');
Route::resource('employee', EmployeeController::class);
Route::resource('service', ServiceController::class);
Route::resource('notice', NoticeController::class);
// Route::put('/admin/service/{service}', [ServiceController::class, 'update'])->name('admin.service.update');
