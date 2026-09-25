<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->string('start_date');
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->string('ward_id');
            $table->string('description');
            $table->string('image')->nullable();
            $table->string('status')->nullable();
            $table->boolean('notice')->default(0);
            $table->string('finish_date')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
