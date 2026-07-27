<?php

namespace Database\Seeders;

use App\Models\Province;
use App\Models\District;   
use App\Models\LocalBody;  
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class NepalAddressSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('data/nepal_address.json'));
        $data = json_decode($json, true);

        foreach ($data as $pData) {
            $province = Province::create(['name' => $pData['province']]);

            foreach ($pData['districts'] as $dData) {
                $district = $province->districts()->create(['name' => $dData['district']]);

                foreach ($dData['local_bodies'] as $mData) {
                    $district->localBodies()->create([
                        'name' => $mData['name'],
                        'total_wards' => $mData['total_wards'],
                    ]);
                }
            }
        }
    }
}