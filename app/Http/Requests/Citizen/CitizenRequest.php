<?php

namespace App\Http\Requests\Citizen;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;

class CitizenRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
   public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $phoneRegex = ['required', 'string', 'regex:/^(97|98)\d{8}$/'];
        return [
            'user_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:citizens,email'],
            'province_id' => ['required', 'exists:provinces,id'],
            'district_id' => ['required', 'exists:districts,id'],
            'local_body_id' => ['required', 'exists:local_bodies,id'],
            'ward' => ['required', 'string', 'max:255'],
           'whatsapp_number' => array_merge($phoneRegex, ['unique:citizens,whatsapp_number']),
            'phone_number'    => array_merge($phoneRegex, ['unique:citizens,phone_number']),
            'password' => [
                'required',
                'confirmed','string'
                // Password::min(8)
                //     ->letters()
                //     ->mixedCase()
                //     ->numbers()
                //     ->symbols(),
            ],
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
