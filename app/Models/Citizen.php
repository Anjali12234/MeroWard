<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class Citizen extends Authenticatable
{
   use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'user_name',
        'email',
        'password',
        'whatsapp_number',
        'phone_number',
        'province_id',
        'district_id',
        'local_body_id',
        'status',
        'ward',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
