<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait FileTrait
{
    public function castingFile(string $defaultData = '', string $defaultPath = '', ?string $fileToDelete = null): Attribute
    {
        return Attribute::make(
            // GETTER
            get: function (?string $value) use ($defaultData) {
                if (empty($value)) {
                    return [];
                }

                $files = json_decode($value, true);

                if (empty($files)) {
                    return [];
                }

                // Convert file paths to URLs
                return array_map(function ($file) use ($defaultData) {
                    if (filter_var($file, FILTER_VALIDATE_URL))
                        return $file;
                    if (Storage::disk('public')->exists($file)) {
                        return Storage::disk('public')->url($file);
                    }
                    return $defaultData;
                }, $files);
            },
            // SETTER
            set: function ($value) use ($defaultPath, $fileToDelete) {
                if (empty($value)) {
                    return null;
                }

                $storedFiles = [];

                // Ensure $value is an array for uniform handling
                if (!is_array($value)) {
                    $value = [$value];
                }

                foreach ($value as $file) {
                    // If already a URL or string path → keep it
                    if (is_string($file)) {
                        $storedFiles[] = $file;
                    }
                    // If uploaded file → store it
                    elseif ($file instanceof UploadedFile) {
                        // Delete old file if specified (optional)
                        if (!empty($fileToDelete) && Storage::disk('public')->exists($fileToDelete)) {
                            Storage::disk('public')->delete($fileToDelete);
                        }

                        $storedFiles[] = $file->store($defaultPath, 'public');
                    }
                }

                // Store JSON string in DB
                return json_encode($storedFiles);
            }
        );
    }
}
