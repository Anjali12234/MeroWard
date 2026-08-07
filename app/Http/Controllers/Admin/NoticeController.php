<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notice\StoreNoticeRequest;
use App\Http\Requests\Notice\UpdateNoticeRequest;
use App\Models\Notice;
use App\Models\OfficeSetting;
use Illuminate\Http\Request;
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
       
        return to_route('admin.notice.index')->with('success', 'Notice Created Successfully');
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
}
