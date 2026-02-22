import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const formatNotificationType = (type) => {
    if (!type) return '';
    const preset = {
        GROUP_JOIN_REQUEST: 'Join request',
        GROUP_JOIN_APPROVED: 'Join request approved',
        GROUP_MEMBER_REMOVED: 'Member removed from group',
        GROUP_MEMBER_LEFT: 'Member left group',
        GROUP_LEFT: 'You left a group',
    };
    if (preset[type]) return preset[type];
    // Fallback: transform SNAKE_CASE into Title Case
    return type
        .toLowerCase()
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const containerRef = useRef(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/notifications');
            const items = response.data || [];
            setNotifications(items);
            setUnreadCount(items.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch once on mount so the badge is correct on page load
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const toggleOpen = () => {
        const next = !open;
        setOpen(next);
        if (next && !loading) {
            fetchNotifications();
        }
    };

    const markAsRead = async (id) => {
        try {
            await axiosClient.post(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={toggleOpen}
                className="relative p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border border-gray-100 z-50">
                    <div className="px-3 py-2 border-b flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Notifications</span>
                        {loading && <span className="text-[10px] text-gray-400">Loading...</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && !loading ? (
                            <div className="px-3 py-4 text-xs text-gray-400 text-center">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`px-3 py-2 text-xs border-b last:border-b-0 ${n.read ? 'bg-white text-gray-500' : 'bg-blue-50 text-gray-800'}`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <p className="font-medium text-[11px] text-gray-700 mb-0.5">{formatNotificationType(n.type)}</p>
                                            <p className="text-[11px] leading-snug">{n.message}</p>
                                        </div>
                                        {!n.read && (
                                            <button
                                                onClick={() => markAsRead(n.id)}
                                                className="text-[10px] text-blue-600 hover:text-blue-800"
                                            >
                                                Mark read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
