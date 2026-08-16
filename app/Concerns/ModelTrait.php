<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

trait ModelTrait
{
    public function castingFile(string $defaultData = '', string $defaultPath = ''): Attribute
    {
        return Attribute::make(
            get: function (?string $value) use ($defaultData) {
                if (!empty($value)) {
                    if (isUrl($value)) {
                        return $value;
                    } else {
                        if (Storage::disk('public')->exists($value)) {
                            return Storage::disk('public')->url($value);
                        } else {
                            return $defaultData;
                        }
                    }
                } else {
                    return $defaultData;
                }
            },
            set: function ($value) use ($defaultPath) {
                if (!empty($value)) {
                    if (isUrl($value)) {
                        return $value;
                    } else {
                        return $value->store($defaultPath, 'public');
                    }
                } else {
                    return null;
                }
            },
        );
    }

    public function scopeUserDataAccordingToWard(Builder $builder, bool $showAll = false): void
    {
        if (!$showAll) {
            if (!empty(Auth::user()->ward_no)) {
                $builder->where('ward_no', Auth::user()->ward_no);
            } else {
                $builder->whereNull('ward_no');
            }
        }
    }

    public function scopeIsActive(Builder $builder, bool $isActive = true): void
    {
        if (Schema::hasColumn($this->getTable(), 'is_active')) {
            $builder->where('is_active', $isActive);
        }
    }
}
