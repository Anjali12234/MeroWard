<?php

namespace App\Http\Requests\OfficeSetting;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOfficeSettingRequest extends FormRequest
{
   public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'office_name' => ['required', 'string'],
            'office_logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'office_cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'office_email' => ['required', 'email'],
            'office_phone' => ['nullable', 'string', 'regex:/^(98|97)\d{8}$/'],
            'desc' => ['required', 'string'],
            'office_address' => ['required', 'string'],
            'office_google_map' => ['required', 'string'],
            'facebook' => ['nullable', 'string'],
            'twitter' => ['nullable', 'string'],
            'instagram' => ['nullable', 'string'],
            'youtube' => ['nullable', 'string'],
            'tiktok' => ['nullable', 'string'],
             'province_id' => ['required', 'exists:provinces,id'],
            'district_id' => ['required', 'exists:districts,id'],
            'local_body_id' => ['required', 'exists:local_bodies,id'],
            'ward' => ['required', 'string', 'max:255'],
        ];
    }
}
