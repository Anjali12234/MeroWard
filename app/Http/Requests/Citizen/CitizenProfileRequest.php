<?php

namespace App\Http\Requests\Citizen;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CitizenProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Get the ID of the currently authenticated citizen
        $citizenId = Auth::guard('citizen')->id();

        $phoneRegex = ['required', 'string', 'regex:/^(97|98)\d{8}$/'];

        return [
            'user_name' => ['required', 'string', 'max:255'],
            
            // Ignore current citizen ID on unique check
            'email' => [
                'required',
                'email',
                Rule::unique('citizens', 'email')->ignore($citizenId),
            ],
            
            'province_id'   => ['required', 'exists:provinces,id'],
            'district_id'   => ['required', 'exists:districts,id'],
            'local_body_id' => ['required', 'exists:local_bodies,id'],
            'ward'          => ['required', 'string', 'max:255'],
            
            'whatsapp_number' => array_merge($phoneRegex, [
                Rule::unique('citizens', 'whatsapp_number')->ignore($citizenId),
            ]),
            
            'phone_number' => array_merge($phoneRegex, [
                Rule::unique('citizens', 'phone_number')->ignore($citizenId),
            ]),

            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'whatsapp_number.regex' => 'The WhatsApp number must be a 10-digit number starting with 97 or 98.',
            'phone_number.regex'    => 'The phone number must be a 10-digit number starting with 97 or 98.',
        ];
    }
}