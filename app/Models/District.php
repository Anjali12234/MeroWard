<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = ['name', 'province_id'];
    public function localBodies()
    {
        return $this->hasMany(LocalBody::class);
    }
    public function citizens()
    {
        return $this->hasMany(Citizen::class);
    }
}
