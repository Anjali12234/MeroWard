<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FrontendController;
use App\Models\District;
use App\Models\LocalBody;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::controller(FrontendController::class)->group(function () {
    Route::get('/', 'index')->name('home');
    Route::get('/employee', 'employeeList')->name('employee');
    Route::get('/service', 'serviceList')->name('service');
    Route::get('/notice', 'noticeList')->name('notice');
    Route::get('/notices/{notice:slug}', 'noticeShow')->name('notices.show');

    Route::get('/event', 'eventList')->name('event');
    Route::get('/events/{event:slug}', 'eventShow')->name('events.show');
    Route::get('/project', 'projectList')->name('project');
    Route::get('/projects/{project:slug}', 'projectShow')->name('projects.show');
    Route::post('/events/{event}/participate', 'toggleEventParticipation')->name('events.participate');
});

Route::get('districts/{provinceId}', fn($id) => District::where('province_id', $id)->get(['id', 'name']));
Route::get('local-bodies/{districtId}', fn($id) => LocalBody::where('district_id', $id)->get(['id', 'name']));

Route::controller(AuthController::class)->group(function () {
    Route::get('/citizenRegister', 'citizenRegisterPage')->name('citizenRegister');
    Route::post('/citizenRegisterStore', 'citizenRegisterStore')->name('citizen.register.store');
    Route::get('/citizenLogin', 'citizenLoginPage')->name('citizenLoginPage');
    Route::post('/citizenLogin', 'citizenLogin')->name('citizenLogin');
    Route::post('/citizenLogout', 'citizenLogout')->name('citizenLogout');
    Route::get('/citizenProfile', 'profileEdit')->name('citizenProfile.edit');
    Route::post('/citizenProfile', 'profileUpdate')->name('citizenProfile.update');
});

require __DIR__ . '/settings.php';
