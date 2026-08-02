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
            'service_name'       => ['required', 'string', 'max:255'],
            'required_documents' => ['required', 'string'],
            'employee_ids'       => ['required', 'array', 'min:1'],
            'employee_ids.*'     => ['required', 'exists:employees,id'],
            'time'               => ['required', 'string', 'max:255'],
            'price'              => ['required', 'string', 'max:255'],
        ];
    }
}
