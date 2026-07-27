<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'super_admin';
    case CEO = 'ceo';
    case IT_OFFICER = 'it_officer';
    case ENGINEER = 'engineer';

    public function label(): string
    {
        return match($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::CEO => 'CEO',
            self::IT_OFFICER => 'IT Officer',
            self::ENGINEER => 'Engineer',
        };
    }
}
