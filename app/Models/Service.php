<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'service_name',
        'required_documents',
        'time',
        'ward_no',
        'price'
    ];

    protected $casts = [
        'employee_id' => 'array',
    ];

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class);
    }
}
