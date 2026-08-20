<?php

namespace App\Http\Requests\Event;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadMinuteRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'minutes_pdf' =>  ['required','file','mimes:pdf,jpg,jpeg,png,doc,docx', 'max:10240'],

        ];
    }
}
