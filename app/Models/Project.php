<?php

namespace App\Models;
use App\Concerns\FileTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
      use HasFactory, SoftDeletes, FileTrait;

    protected $fillable = [
        'title',
        'slug',
        'start_date',
        'employee_id',
        'ward_id',
        'description',
        'image',
        'notice',
        'status',
        'finish_date',
    ];

    protected function title(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => [
                'title' => $value,
                'slug' => Str::snake($value),
            ],
        );
    }
    
    public function image(): Attribute
    {
        return $this->castingFile(defaultPath: 'Project');
    }
     public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
