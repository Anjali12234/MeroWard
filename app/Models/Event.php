<?php

namespace App\Models;

use App\Concerns\FileTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'minutes_pdf'
    ];
     public function minutesPdf(): Attribute
    {
        return $this->castingFile(defaultPath: 'event', fileToDelete: $this->attributes['minutes_pdf'] ?? null);
    }
}
