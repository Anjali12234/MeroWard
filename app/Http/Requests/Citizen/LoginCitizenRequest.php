<?php

namespace App\Http\Requests\Citizen;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginCitizenRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:citizens,email'],
            'password' => ['required','string'],
        ];
    }
}
