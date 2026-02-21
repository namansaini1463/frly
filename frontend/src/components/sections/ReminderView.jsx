import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../ConfirmModal';
import { ChevronRight } from 'lucide-react';

const ReminderView = ({ sectionId }) => {
    const { user } = useAuth();
    const [reminders, setReminders] = useState([]);
    const [newReminderTitle, setNewReminderTitle] = useState('');
    const [newReminderDescription, setNewReminderDescription] = useState('');
    const [newReminderTime, setNewReminderTime] = useState('');
    const [notify, setNotify] = useState(false);
    const [frequency, setFrequency] = useState('ONCE');
    const [editingId, setEditingId] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState(null);
    const [showSent, setShowSent] = useState(false);

    useEffect(() => {
        fetchReminders();
    }, [sectionId]);

    // Keep the notify default in sync with the user's profile preference
    useEffect(() => {
        if (user && typeof user.reminderEmailEnabled === 'boolean') {
            setNotify(user.reminderEmailEnabled);
        }
    }, [user]);

    const fetchReminders = async () => {
        try {
            const res = await axiosClient.get(`/groups/sections/${sectionId}/reminders`);
            setReminders(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to fetch reminders", error);
            // If 403, parent GroupView should have handled it or we can show error here
        }
    };

    const handleAddReminder = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: newReminderTitle,
                description: newReminderDescription,
                triggerTime: newReminderTime,
                notify,
                frequency
            };

            if (editingId) {
                await axiosClient.put(`/groups/sections/reminders/${editingId}`, payload);
                await fetchReminders();
                setEditingId(null);
                toast.success("Reminder updated!");
            } else {
                const res = await axiosClient.post(`/groups/sections/${sectionId}/reminders`, payload);
                const createdId = res.data;
                const newReminder = {
                    id: createdId,
                    title: newReminderTitle,
                    description: newReminderDescription,
                    triggerTime: newReminderTime,
                    notify,
                    frequency,
                    isSent: false
                };
                setReminders(prev => [newReminder, ...prev]);
                toast.success("Reminder set!");
            }

            setNewReminderTitle('');
            setNewReminderDescription('');
            setNewReminderTime('');
            setNotify(user && typeof user.reminderEmailEnabled === 'boolean' ? user.reminderEmailEnabled : false);
            setFrequency('ONCE');
        } catch (error) {
            console.error("Failed to add reminder", error);
            toast.error("Failed to save reminder");
        }
    };

    const handleDelete = (reminder) => {
        setConfirmConfig({
            title: 'Delete reminder?',
            message: `Delete reminder "${reminder.title}"?`,
            confirmLabel: 'Delete',
            onConfirm: async () => {
                try {
                    await axiosClient.delete(`/groups/sections/reminders/${reminder.id}`);
                    setReminders(prev => prev.filter(r => r.id !== reminder.id));
                    toast.success('Reminder deleted');
                } catch (error) {
                    console.error('Failed to delete reminder', error);
                    toast.error('Failed to delete reminder');
                }
            }
        });
    };

    const startEdit = (reminder) => {
        setEditingId(reminder.id);
        setNewReminderTitle(reminder.title || '');
        setNewReminderDescription(reminder.description || '');
        if (reminder.triggerTime) {
            const dt = new Date(reminder.triggerTime);
            const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setNewReminderTime(local);
        } else {
            setNewReminderTime('');
        }
        setNotify(!!reminder.notify);
        setFrequency(reminder.frequency || 'ONCE');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setNewReminderTitle('');
        setNewReminderDescription('');
        setNewReminderTime('');
        setNotify(user && typeof user.reminderEmailEnabled === 'boolean' ? user.reminderEmailEnabled : false);
        setFrequency('ONCE');
    };

    const activeReminders = reminders.filter(r => !r.isSent);
    const sentReminders = reminders.filter(r => r.isSent);

    return (
        <div className="h-full flex flex-col p-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Reminders</h2>
            <p className="text-xs text-gray-500 mb-4">Create time-based reminders. Active ones stay on top; sent ones are kept separately.</p>

            {/* SECTION 1: Reminder details */}
            <form onSubmit={handleAddReminder} className="space-y-4 mb-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-3">
                    <div>
                        <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase mb-1">Reminder details</p>
                        <p className="text-[11px] text-gray-400">Give your reminder a clear title and optional description.</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Reminder title"
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={newReminderDescription}
                        onChange={(e) => setNewReminderDescription(e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-y min-h-[70px]"
                    />
                </div>

                {/* SECTION 2: Schedule */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase mb-1">Schedule</p>
                            <p className="text-[11px] text-gray-400">Choose when this reminder should fire and how often.</p>
                        </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-[11px] font-medium text-gray-600">Due date &amp; time</label>
                            <input
                                type="datetime-local"
                                value={newReminderTime}
                                onChange={(e) => setNewReminderTime(e.target.value)}
                                className="w-full h-10 border border-gray-200 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                required
                            />
                            <p className="text-[11px] text-gray-400">Tip: set it to when you want to be nudged.</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[11px] font-medium text-gray-600">Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full h-10 border border-gray-200 px-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            >
                                <option value="ONCE">Once</option>
                                <option value="DAILY">Daily</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="MONTHLY">Monthly</option>
                                <option value="YEARLY">Yearly</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Notification */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase mb-1">Notification</p>
                        <p className="text-[11px] text-gray-400">We can also email you when this reminder is due.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setNotify(!notify)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus:outline-none ${notify ? 'bg-blue-600 border-blue-600' : 'bg-gray-200 border-gray-200'}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${notify ? 'translate-x-5' : 'translate-x-1'}`}
                            />
                        </button>
                        <span className="text-xs text-gray-700">Email me for this reminder</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                    {editingId && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700"
                    >
                        {editingId ? 'Update reminder' : 'Set reminder'}
                    </button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-4 mt-1">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Active</h3>
                            {activeReminders.length > 0 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{activeReminders.length}</span>
                            )}
                        </span>
                    </div>
                    {activeReminders.length === 0 && (
                        <p className="text-gray-400 text-xs">No active reminders.</p>
                    )}
                    <div className="space-y-2">
                        {activeReminders.map(reminder => (
                            <div
                                key={reminder.id}
                                className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start justify-between gap-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{reminder.title}</h3>
                                            <p className="text-[11px] text-gray-600 mt-0.5">
                                                {reminder.triggerTime && new Date(reminder.triggerTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {reminder.description && (
                                        <p className="text-xs text-gray-700 mt-1 whitespace-pre-line">{reminder.description}</p>
                                    )}
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-gray-600">
                                        {reminder.notify && (
                                            <span className="px-2 py-0.5 rounded-full bg-white/70 text-blue-700 border border-blue-100">Email on</span>
                                        )}
                                        {reminder.frequency && (
                                            <span className="px-2 py-0.5 rounded-full bg-white/70 text-gray-800 border border-amber-100">{reminder.frequency}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 ml-1">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(reminder)}
                                        className="px-2 py-1 rounded-md border border-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(reminder)}
                                        className="text-[11px] text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-3">
                    <button
                        type="button"
                        onClick={() => setShowSent(prev => !prev)}
                        className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-md"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Sent</span>
                            {sentReminders.length > 0 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{sentReminders.length}</span>
                            )}
                        </span>
                        <ChevronRight
                            size={14}
                            className={`text-gray-400 transform transition-transform ${showSent ? 'rotate-90' : ''}`}
                        />
                    </button>
                    {showSent && (
                        <div className="mt-2 space-y-2">
                            {sentReminders.length === 0 && (
                                <p className="text-gray-400 text-xs">No sent reminders yet.</p>
                            )}
                            {sentReminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-start gap-3 opacity-80"
                                >
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-medium text-gray-800 truncate">{reminder.title}</h3>
                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                            {reminder.triggerTime && new Date(reminder.triggerTime).toLocaleString()}
                                        </p>
                                        {reminder.description && (
                                            <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{reminder.description}</p>
                                        )}
                                        <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500">
                                            {reminder.notify && (
                                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Email</span>
                                            )}
                                            {reminder.frequency && (
                                                <span className="px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-100">{reminder.frequency}</span>
                                            )}
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Sent</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(reminder)}
                                            className="text-red-500 hover:text-red-700 p-1 text-xs"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {reminders.length === 0 && (
                    <p className="text-gray-400 text-center text-xs">No reminders set yet.</p>
                )}
            </div>
            {confirmConfig && (
                <ConfirmModal
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    confirmLabel={confirmConfig.confirmLabel}
                    onCancel={() => setConfirmConfig(null)}
                    onConfirm={async () => {
                        const fn = confirmConfig.onConfirm;
                        setConfirmConfig(null);
                        if (fn) {
                            await fn();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ReminderView;
