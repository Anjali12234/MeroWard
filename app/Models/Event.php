<?php

namespace App\Models;

use App\Concerns\FileTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory, SoftDeletes, FileTrait;

    protected $fillable = [
        'title',
        'description',
        'location',
        'event_date',
        'status',
        'ward_no',
        'minutes_pdf',
        'slug'
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
    
      public function minutesPdf(): Attribute
    {
        return $this->castingFile(defaultPath: 'event', fileToDelete: $this->attributes['minutes_pdf'] ?? null);
    }
}
