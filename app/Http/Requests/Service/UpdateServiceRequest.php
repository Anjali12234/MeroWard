<?php

namespace App\Http\Requests\Service;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_name' => ['required', 'string', 'max:255'],
            'required_documents' => ['required', 'string'],
            'time' => ['required', 'string', 'max:255'],
            'price' => ['required', 'string', 'max:255'],
            'employee_id' => ['required', 'array'],
            'employee_id.*' => ['exists:employees,id'],
        ];
    }
}
