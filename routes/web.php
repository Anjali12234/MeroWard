<?php

use App\Models\District;
use App\Models\LocalBody;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');
// routes/web.php or routes/api.php
Route::get('districts/{provinceId}', fn ($id) => District::where('province_id', $id)->get(['id', 'name']));
Route::get('local-bodies/{districtId}', fn ($id) => LocalBody::where('district_id', $id)->get(['id', 'name']));


require __DIR__.'/settings.php';
