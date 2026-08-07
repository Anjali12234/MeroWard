<?php

namespace App\Models;

use App\Concerns\FileTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;


class Notice extends Model
{
    use HasFactory, SoftDeletes, FileTrait;

    protected $fillable = [
        'title_en',
        'title_ne',
        'slug',
        'published_date',
        'ward_id',
        'document',
    ];

    protected function titleEn(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => [
                'title_en' => $value,
                'slug' => Str::snake($value),
            ],
        );
    }
    
    public function document(): Attribute
    {
        return $this->castingFile(defaultPath: 'Notice');
    }
}
