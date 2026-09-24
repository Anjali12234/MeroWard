<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminEventAttendanceController extends Controller
{
    public function index(Event $event)
    {
        // Get all registered & walk-in attendees from pivot table
        $attendanceList = DB::table('citizen_event')
            ->leftJoin('citizens', 'citizen_event.citizen_id', '=', 'citizens.id')
            ->where('citizen_event.event_id', $event->id)
            ->select(
                'citizen_event.id as pivot_id',
                'citizen_event.citizen_id',
                'citizen_event.status',
                'citizen_event.registration_type',
                'citizen_event.guest_name',
                'citizen_event.guest_phone',
                'citizen_event.guest_ward',
                'citizen_event.created_at',
                'citizens.user_name as citizen_name',
                'citizens.phone_number as citizen_phone',
                'citizens.ward as citizen_ward'
            )
            ->orderBy('citizen_event.created_at', 'desc')
            ->get();

        // Get system citizens list for dropdown/lookup mode
        $allSystemCitizens = Citizen::select('id', 'user_name', 'phone_number', 'ward')->get();

        $stats = [
            'total' => $attendanceList->count(),
            'attended' => $attendanceList->where('status', 'attended')->count(),
            'registered' => $attendanceList->where('status', 'registered')->count(),
            'walk_ins' => $attendanceList->where('registration_type', 'walk_in')->count(),
        ];

        return Inertia::render('Admin/Event/Attendance', [
            'event' => $event,
            'attendanceList' => $attendanceList,
            'allSystemCitizens' => $allSystemCitizens,
            'stats' => $stats,
        ]);
    }

    // Toggle Attendance Status (Registered -> Attended / Absent)
    public function updateStatus(Request $request, $pivotId)
    {
        $request->validate([
            'status' => 'required|in:registered,attended,absent',
        ]);

        DB::table('citizen_event')
            ->where('id', $pivotId)
            ->update([
                'status' => $request->status,
                'updated_at' => now(),
            ]);

        return redirect()->back()->with('success', 'Attendance status updated successfully!');
    }

    // Add Offline Walk-In Entry (Without smartphone or prior RSVP)
    public function storeWalkIn(Request $request, Event $event)
    {
        $request->validate([
            'entry_type' => 'required|in:existing,guest',
            'citizen_id' => 'nullable|required_if:entry_type,existing|exists:citizens,id',
            'guest_name' => 'nullable|required_if:entry_type,guest|string|max:255',
            'guest_phone' => 'nullable|string|max:20',
            'guest_ward' => 'nullable|string|max:50',
        ]);

        if ($request->entry_type === 'existing') {
            // Check if already in pivot
            $exists = DB::table('citizen_event')
                ->where('event_id', $event->id)
                ->where('citizen_id', $request->citizen_id)
                ->first();

            if ($exists) {
                DB::table('citizen_event')->where('id', $exists->id)->update([
                    'status' => 'attended',
                    'updated_at' => now(),
                ]);
            } else {
                DB::table('citizen_event')->insert([
                    'event_id' => $event->id,
                    'citizen_id' => $request->citizen_id,
                    'status' => 'attended',
                    'registration_type' => 'walk_in',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        } else {
            // Unregistered Guest Walk-In
            DB::table('citizen_event')->insert([
                'event_id' => $event->id,
                'citizen_id' => null,
                'guest_name' => $request->guest_name,
                'guest_phone' => $request->guest_phone,
                'guest_ward' => $request->guest_ward,
                'status' => 'attended',
                'registration_type' => 'walk_in',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Walk-in attendee added and marked present!');
    }
}
