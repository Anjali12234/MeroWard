<?php

namespace App\Concerns;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

trait ProfileUpdateValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
            'role' => $this->roleRules(),
            'province_id' => $this->provinceIdRules(),
            'district_id' => $this->districtIdRules(),
            'local_body_id' => $this->localBodyIdRules(),
            'ward' => $this->wardRules(),
        ];
    }

    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
    protected function roleRules(): array
    {
        return ['required', new Enum(RoleEnum::class)];
    }

    protected function provinceIdRules(): array
    {
        return ['required', 'integer', Rule::exists('provinces', 'id')];
    }

    protected function districtIdRules(): array
    {
        return ['required', 'integer', Rule::exists('districts', 'id')];
    }

    protected function localBodyIdRules(): array
    {
        return ['required', 'integer', Rule::exists('local_bodies', 'id')];
    }

    protected function wardRules(): array
    {
        return ['required', 'string', 'max:10'];
    }
}
