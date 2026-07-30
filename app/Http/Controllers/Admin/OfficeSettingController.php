<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeSetting\StoreOfficeSettingRequest;
use App\Models\OfficeSetting;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

use function App\Helpers\checkFileExists;

class OfficeSettingController extends Controller
{
    public function index()
    {
        $locationData = Province::with(['districts.localBodies'])->get()->map(function ($province) {
            return [
                'id' => $province->id,
                'name' => $province->name,
                'districts' => $province->districts->map(function ($district) {
                    return [
                        'id' => $district->id,
                        'name' => $district->name,
                        'local_bodies' => $district->localBodies->map(function ($lb) {
                            return [
                                'id' => $lb->id,
                                'name' => $lb->name,
                                'total_wards' => $lb->total_wards,
                            ];
                        }),
                    ];
                }),
            ];
        });
        $officeSetting = OfficeSetting::first();
        return Inertia::render('Admin/OfficeSetting/Index', [
            'officeSetting' => $officeSetting,
            'locationData' => $locationData

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
