<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocalBody extends Model
{
    
    protected $fillable = ['district_id', 'name', 'total_wards'];

    public function district()
    {
        return $this->belongsTo(District::class);
    }

}
