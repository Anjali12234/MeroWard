<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notice\StoreNoticeRequest;
use App\Http\Requests\Notice\UpdateNoticeRequest;
use App\Mail\SendNoticeToAllUser;
use App\Models\Citizen;
use App\Models\Notice;
use App\Models\OfficeSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NoticeController extends Controller
{
    public function index()
    {
        $notices = Notice::latest()->paginate(10);

        return Inertia::render('Admin/Notice/Index', [
            'notices' => $notices,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Notice/Create');
    }

    public function store(StoreNoticeRequest $request)
    {
        $officeSetting = OfficeSetting::first();

        // FileTrait automatically intercepts 'document' and handles storing files to public disk
        Notice::create($request->validated() + [
            'ward_id' => $officeSetting?->ward
        ]);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Notice Created Successfully.')]);
        return to_route('admin.notice.index');
    }

    public function show(Notice $notice)
    {
        return Inertia::render('Admin/Notice/Show', [
            'notice' => $notice,
        ]);
    }

    public function edit(Notice $notice)
    {
        return Inertia::render('Admin/Notice/Edit', [
            'notice' => $notice,
        ]);
    }

    public function update(UpdateNoticeRequest $request, Notice $notice)
    {
        $officeSetting = OfficeSetting::first();

        $notice->update($request->validated() + [
            'ward_id' => $officeSetting?->ward
        ]);

        return to_route('admin.notice.index')->with('success', 'Notice Edited Successfully');
    }

    public function destroy(Notice $notice)
    {
        $notice->delete();

        return to_route('admin.notice.index')->with('success', 'Notice Deleted Successfully');
    }

    public function toggleStatus(Notice $notice)
    {
        $notice->update([
            'status' => !$notice->status,
        ]);

        return to_route('admin.notice.index')->with('success', 'Notice Status Updated Successfully');
    }

    public function sendNoticeToAll(Notice $notice)
    {
        // Ensure ward values match properly (e.g., casting or matching exact formats)
        $users = Citizen::where('ward', (string) $notice->ward_id)
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->get();

        if ($users->isEmpty()) {
            return back()->with('error', 'No citizens found registered in this ward.');
        }

        $sent = 0;
        $failed = 0;

        foreach ($users as $user) {
            try {
                // Use queue() instead of send() to dispatch to worker
               Mail::to($user->email)->queue(new SendNoticeToAllUser($notice));
                $sent++;
            } catch (\Throwable $e) {
                $failed++;
                Log::error('Notice email dispatch failed', [
                    'citizen_id' => $user->id,
                    'email'      => $user->email,
                    'error'      => $e->getMessage(),
                ]);
            }
        }

        return back()->with(
            'success',
            "Notice queued for delivery. Total queued: {$sent}, Failed: {$failed}."
        );
    }
}
