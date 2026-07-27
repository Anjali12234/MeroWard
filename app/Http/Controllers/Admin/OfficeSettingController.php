<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeSetting\StoreOfficeSettingRequest;
use App\Models\OfficeSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

use function App\Helpers\checkFileExists;

class OfficeSettingController extends Controller
{
    public function index()
    {
        $officeSetting = OfficeSetting::first();
        return Inertia::render('Admin/OfficeSetting/Index', [
            'officeSetting' => $officeSetting
        ]);
    }


    public function store(StoreOfficeSettingRequest $request)
    {

        $officeSetting = OfficeSetting::latest()->first();

        if (!empty($officeSetting)) {
            $officeSetting->update(checkFileExists($request->validated(), [
                'office_logo' => null,
                'office_cover' => null,
            ]));
        } else {
            OfficeSetting::create(
                checkFileExists($request->validated(), [
                    'office_logo' => null,
                    'office_cover' => null,
                ])
            );
        }


        Cache::forget('office_setting');
        return to_route('admin.office-setting.index')
            ->with('success', 'Office Setting Updated Successfully');
    }
}
