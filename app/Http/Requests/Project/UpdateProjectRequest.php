<?php

namespace App\Http\Requests\Project;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
     public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'status' => ['required', 'string','max:255'],

            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'start_date' => ['required', 'date'],
            'employee_id' => ['required', 'exists:employees,id'],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'finish_date' => ['nullable', 'date'],

        ];
    }
}
