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
        Schema::create('citizen_event', function (Blueprint $table) {
            $table->id();
           $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('citizen_id')->nullable()->constrained('citizens')->onDelete('cascade');
            
            // For offline walk-ins who don't have a registered citizen account
            $table->string('guest_name')->nullable();
            $table->string('guest_phone')->nullable();
            $table->string('guest_ward')->nullable();
            
            // Status track
            $table->enum('status', ['registered', 'attended', 'absent'])->default('registered');
            $table->enum('registration_type', ['online', 'walk_in'])->default('online');
            $table->text('remarks')->nullable();
            
            $table->timestamps();

            // Prevent duplicate online RSVPs for registered citizens
            $table->unique(['event_id', 'citizen_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizen_event');
    }
};
