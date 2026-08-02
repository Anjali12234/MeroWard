<?php

namespace App\Models;

use App\Concerns\FileTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
   use HasFactory, SoftDeletes, FileTrait;

    protected $fillable = [
        'name',
        'image',
        'designation',
        'section',
        'position',
        'email',
        'phone',
        'ward_no',
        'is_employee',
       
    ];

    public function image(): Attribute
    {
        return $this->castingFile(defaultPath: 'employee', fileToDelete: $this->attributes['image'] ?? null);
    }
    public function services()
    {
        return $this->hasMany(Service::class);
    }
   
}
