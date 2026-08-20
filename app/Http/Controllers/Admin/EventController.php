<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Requests\Event\UploadMinuteRequest;
use App\Models\Event;
use App\Models\OfficeSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use function App\Helpers\deleteFile;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::latest()->paginate(10);
        return Inertia::render('Admin/Event/Index', [
            'event' => $events
        ]);
    }
    public function create()
    {
        $statuses = collect(EventStatus::cases())->map(fn($status) => [
            'value' => $status->value,
            'label' => $status->label(),
        ]);

        return Inertia::render('Admin/Event/Create', [
            'statuses' => $statuses,
        ]);
    }
    public function store(StoreEventRequest $request)
    {
        $officeSetting = OfficeSetting::first();

        Event::create($request->validated() + [
            'ward_no' => $officeSetting?->ward, // Safely gets ward_id or null if no record exists
        ]);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event Created Successfully.')]);

        return to_route('admin.event.index');
    }
    public function show(Event $event)
    {
        return Inertia::render('Admin/Event/Show', [
            'event' => $event,
        ]);
    }
    public function edit(Event $event)
    {
        $statuses = collect(EventStatus::cases())->map(fn($status) => [
            'value' => $status->value,
            'label' => $status->label(),
        ]);
        return Inertia::render('Admin/Event/Edit', [
            'event' => $event,
            'statuses' => $statuses,
        ]);
    }
    public function update(UpdateEventRequest $request, Event $event)
    {
        $officeSetting = OfficeSetting::first();

        $data = $request->validated() + ['ward_no' => $officeSetting?->ward,];
        // if you want old minutes_pdf deleted when new one is uploaded
        if ($request->hasFile('minutes_pdf')) {
            deleteFile($event->getRawOriginal('minutes_pdf'));
        }
        $event->update($data);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event Created Successfully.')]);

        return to_route('admin.event.index');
    }
    public function destroy(Event $event)
    {
        $minutePdfPath = $event->getRawOriginal('minutes_pdf');
        if ($minutePdfPath && Storage::disk('public')->exists($minutePdfPath)) {
            Storage::disk('public')->delete($minutePdfPath);
        }
        $event->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event Deleted Successfully')]);

        return to_route('admin.event.index');
    }
    public function uploadMinutePage(Event $event)
    {
        return Inertia::render('Admin/Event/UploadMinute', [
            'event' => $event
        ]);
    }
    public function uploadMinute(UploadMinuteRequest $request, Event $event)
    {

        $data = $request->validated();
        if ($request->hasFile('minutes_pdf')) {
            deleteFile($event->getRawOriginal('minutes_pdf'));
        }
        $event->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event Deleted Successfully')]);

        return to_route('admin.event.index');
    }
}
