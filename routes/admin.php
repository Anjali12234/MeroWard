<?php

use App\Http\Controllers\Admin\AdminEventAttendanceController;
use App\Http\Controllers\Admin\CitizenController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\NoticeController;
use App\Http\Controllers\Admin\OfficeSettingController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('office-setting', OfficeSettingController::class);
Route::resource('citizen', CitizenController::class);
Route::patch('citizens/{citizen}/status', [CitizenController::class, 'status'])->name('citizens.status');
Route::resource('employee', EmployeeController::class);
Route::resource('event', EventController::class);
Route::get('events/{event}/upload-minute', [EventController::class, 'uploadMinutePage'])
    ->name('uploadMinutePage');
Route::post('events/{event}/upload-minute', [EventController::class, 'uploadMinute'])
    ->name('uploadMinute');
Route::resource('service', ServiceController::class);
Route::resource('notice', NoticeController::class);
Route::post('send-mail-to-all/{notice}', [NoticeController::class, 'sendNoticeToAll'])->name('SendMailToUser');
Route::resource('project', ProjectController::class);
Route::post('send-mail-of-project/{project}', [ProjectController::class, 'sendNoticeToAll'])->name('SendMailofProject');

Route::get('/events/{event}/attendance', [AdminEventAttendanceController::class, 'index'])->name('events.attendance.index');
    Route::patch('/event/attendance/{pivotId}', [AdminEventAttendanceController::class, 'updateStatus'])->name('events.attendance.update');
    Route::post('/events/{event}/walk-in', [AdminEventAttendanceController::class, 'storeWalkIn'])->name('events.attendance.walkin');