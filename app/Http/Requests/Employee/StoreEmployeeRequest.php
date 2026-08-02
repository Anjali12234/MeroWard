<?php

namespace App\Http\Requests\Employee;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
       return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['required', 'image', 'mimes:png,jpg,jpeg'],
            'designation' => ['required','string', 'max:255'],
            'section' => ['required', 'string','max:255'],
            'position' => ['nullable', 'integer'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string','max:255'],
            'is_employee' => ['required', 'boolean'],
        ];
    }
}
