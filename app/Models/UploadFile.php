<?php

namespace App\Models;

use App\Concerns\ModelTrait;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UploadFile extends Model
{
    use ModelTrait;

    protected $fillable = [
        'file_name',
        'url',
    ];

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }

    public function url(): Attribute
    {
        return Attribute::get(
            function (?string $value) {
                if (!empty($value)) {
                    if (isUrl($value)) {
                        return $value;
                    } else {
                        if (Storage::disk('public')->exists($value)) {
                            return Storage::disk('public')->url($value);
                        } else {
                            return null;
                        }
                    }
                } else {
                    return null;
                }
            },
        );
    }
}
