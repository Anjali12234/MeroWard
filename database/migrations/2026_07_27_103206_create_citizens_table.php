<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('citizens', function (Blueprint $table) {
            $table->id();
            $table->string('user_name');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('whatsapp_number');
            $table->string('phone_number');
            $table->foreignId('province_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('district_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('local_body_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('ward')->nullable();
            $table->string('email')->unique();
            $table->boolean('status')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('citizen_password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('citizen_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizens');
         Schema::dropIfExists('citizen_password_reset_tokens');
        Schema::dropIfExists('citizen_sessions');
    }
};
