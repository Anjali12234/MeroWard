<?php

namespace App\Http\Requests\Notice;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateNoticeRequest extends FormRequest
{
   public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_en'       => ['required', 'string', 'max:255'],
            'title_ne'       => ['required', 'string', 'max:255'], // Updated to nullable
            'slug'           => ['nullable', 'string', 'max:255', 'unique:notices,slug'],
            'published_date' => ['required', 'date'],
            'document' => ['required', 'array', 'min:1'],
            'document.*' =>  ['file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:10240'],
        ];
    }
}
