import React, { useState, useMemo } from 'react';
import { router, useForm } from '@inertiajs/react';

interface Attendee {
  pivot_id: number;
  citizen_id?: number;
  status: 'registered' | 'attended' | 'absent';
  registration_type: 'online' | 'walk_in';
  guest_name?: string;
  guest_phone?: string;
  guest_ward?: string;
  citizen_name?: string;
  citizen_phone?: string;
  citizen_ward?: string;
  created_at: string;
}

interface SystemCitizen {
  id: number;
  user_name: string;
  phone_number: string;
  ward: string;
}

export default function EventAttendance({ event, attendanceList = [], allSystemCitizens = [], stats }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Search state for the Citizen Combobox dropdown inside the modal
  const [citizenSearch, setCitizenSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Form for Walk-In / Manual Registration
  const { data, setData, post, reset, processing, errors } = useForm({
    entry_type: 'existing', // 'existing' | 'guest'
    citizen_id: '',
    guest_name: '',
    guest_phone: '',
    guest_ward: '',
  });

  // Filter main table attendees
  const filteredAttendees = useMemo(() => {
    return attendanceList.filter((item: Attendee) => {
      const name = item.citizen_name || item.guest_name || '';
      const phone = item.citizen_phone || item.guest_phone || '';
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm)
      );
    });
  }, [attendanceList, searchTerm]);

  // Filter citizens inside the modal search dropdown
  const filteredCitizens = useMemo(() => {
    if (!citizenSearch.trim()) return allSystemCitizens;
    const q = citizenSearch.toLowerCase();
    return allSystemCitizens.filter((c: SystemCitizen) => {
      const nameMatch = c.user_name?.toLowerCase().includes(q);
      const phoneMatch = c.phone_number?.includes(q);
      const wardMatch = String(c.ward || '').includes(q);
      return nameMatch || phoneMatch || wardMatch;
    });
  }, [allSystemCitizens, citizenSearch]);

  // Get selected citizen object to show in the closed select button
  const selectedCitizen = useMemo(() => {
    return allSystemCitizens.find((c: SystemCitizen) => String(c.id) === String(data.citizen_id));
  }, [allSystemCitizens, data.citizen_id]);

  const handleStatusToggle = (pivotId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'attended' ? 'registered' : 'attended';
    router.patch(`/admin/event/attendance/${pivotId}`, { status: nextStatus }, {
      preserveScroll: true,
    });
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/events/${event.id}/walk-in`, {
      onSuccess: () => {
        reset();
        setCitizenSearch('');
        setIsDropdownOpen(false);
        setShowModal(false);
      },
    });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <button
            onClick={() => router.visit('/admin/event')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1 inline-block"
          >
            ← Back to Events List
          </button>
          <h1 className="text-xl font-bold text-slate-800">
            Attendance Roster: {event?.title}
          </h1>
          <p className="text-xs text-slate-500">
            📍 Location: {event?.location} | Date: {event?.event_date}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2"
        >
          ➕ Add Manual / Walk-In Attendee
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold">Total Registered</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{stats?.total ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-emerald-600 font-semibold">Verified Present</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{stats?.attended ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-amber-600 font-semibold">Pending Check-in</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{stats?.registered ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-sky-600 font-semibold">Offline Walk-Ins</p>
          <p className="text-2xl font-bold text-sky-700 mt-1">{stats?.walk_ins ?? 0}</p>
        </div>
      </div>

      {/* MAIN SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <input
          type="text"
          placeholder="🔍 Search attendee by Name or Phone Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
              <th className="p-3">SN</th>
              <th className="p-3">Attendee Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Ward</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((item: Attendee, index: number) => {
                const isAttended = item.status === 'attended';
                const name = item.citizen_name || item.guest_name || 'Anonymous Guest';
                const phone = item.citizen_phone || item.guest_phone || 'N/A';
                const ward = item.citizen_ward || item.guest_ward || 'N/A';

                return (
                  <tr key={item.pivot_id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                    <td className="p-3 font-medium text-slate-500">{index + 1}</td>
                    <td className="p-3 font-semibold text-slate-800">{name}</td>
                    <td className="p-3 text-slate-600">{phone}</td>
                    <td className="p-3 text-slate-600">Ward {ward}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        item.registration_type === 'walk_in'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-sky-100 text-sky-700'
                      }`}>
                        {item.registration_type === 'walk_in' ? 'Offline Walk-In' : 'Online RSVP'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        isAttended
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {isAttended ? '✓ Present' : '🟡 Registered'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleStatusToggle(item.pivot_id, item.status)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          isAttended
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        {isAttended ? 'Mark Pending' : 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                  No attendees matching search or registered for this event yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MANUAL WALK-IN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add Manual Walk-In Attendee</h3>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setIsDropdownOpen(false);
                }} 
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Entry Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="entry_type"
                      value="existing"
                      checked={data.entry_type === 'existing'}
                      onChange={() => {
                        setData('entry_type', 'existing');
                        setData('guest_name', '');
                        setData('guest_phone', '');
                        setData('guest_ward', '');
                      }}
                    />
                    Search Registered System Citizen
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="entry_type"
                      value="guest"
                      checked={data.entry_type === 'guest'}
                      onChange={() => {
                        setData('entry_type', 'guest');
                        setData('citizen_id', '');
                      }}
                    />
                    Guest / No Phone Entry
                  </label>
                </div>
              </div>

              {data.entry_type === 'existing' ? (
                <div className="relative">
                  <label className="block font-semibold text-slate-700 mb-1">Select Citizen</label>
                  
                  {/* Select Trigger Box */}
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer flex justify-between items-center text-slate-700 hover:bg-slate-100/80 transition"
                  >
                    <span className="truncate">
                      {selectedCitizen ? (
                        <span className="font-medium text-slate-800">
                          {selectedCitizen.user_name} ({selectedCitizen.phone_number ?? 'No Phone'}) - Ward {selectedCitizen.ward}
                        </span>
                      ) : (
                        <span className="text-slate-400">-- Select / Search Registered Citizen --</span>
                      )}
                    </span>
                    <span className="text-slate-400 text-[10px]">▼</span>
                  </div>

                  {/* Dropdown Box with Live Search Input */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg p-2 max-h-60 overflow-hidden flex flex-col">
                      <div className="p-1 border-b mb-1">
                        <input
                          type="text"
                          autoFocus
                          placeholder="Type name, phone, or ward..."
                          value={citizenSearch}
                          onChange={(e) => setCitizenSearch(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="overflow-y-auto max-h-40 space-y-0.5">
                        {filteredCitizens.length > 0 ? (
                          filteredCitizens.map((c: SystemCitizen) => {
                            const isSelected = String(data.citizen_id) === String(c.id);
                            return (
                              <div
                                key={c.id}
                                onClick={() => {
                                  setData('citizen_id', String(c.id));
                                  setIsDropdownOpen(false);
                                }}
                                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition ${
                                  isSelected
                                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <span>
                                  {c.user_name} ({c.phone_number ?? 'No Phone'}) - Ward {c.ward}
                                </span>
                                {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-3 text-center text-slate-400">
                            No citizen found matching "{citizenSearch}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {errors?.citizen_id && <p className="text-xs text-red-500 mt-1">{errors.citizen_id}</p>}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={data.guest_name}
                      onChange={(e) => setData('guest_name', e.target.value)}
                      placeholder="e.g. Ram Bahadur Thapa"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={data.guest_phone}
                      onChange={(e) => setData('guest_phone', e.target.value)}
                      placeholder="Leave empty if no phone"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ward Number</label>
                    <input
                      type="text"
                      value={data.guest_ward}
                      onChange={(e) => setData('guest_ward', e.target.value)}
                      placeholder="e.g. 4"
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Save & Mark Present'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}