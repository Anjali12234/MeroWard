<?php

namespace App\Http\Requests\Event;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    
    public function authorize(): bool
    {
        return true;
    }

   
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required','string','max:255' ],
            'location' => ['required','string', 'max:255'],
            'event_date' => ['required', 'string','max:255'],
            'status' => ['required', 'string','max:255'],
        ];
    }
}
