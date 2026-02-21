import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const UserInfoModal = ({ member, onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!member?.userId) return;
      setLoading(true);
      try {
        const res = await axiosClient.get(`/users/${member.userId}`);
        setUser(res.data);
      } catch (e) {
        // fallback to basic member info
        setUser({
          id: member.userId,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          contact: null,
          pfpUrl: null,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [member]);

  if (!member) return null;

  const display = user || {
    id: member.userId,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Member details</h2>
            <p className="text-xs text-gray-500 mt-0.5">Quick view of this member's info.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Close
          </button>
        </div>
        <div className="px-5 py-4 text-sm text-gray-800">
          {loading ? (
            <div className="text-xs text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-[11px] font-semibold text-blue-600 border border-blue-100">
                  {((display.firstName?.[0] || '') + (display.lastName?.[0] || '') || (display.email?.[0] || '?')).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{display.firstName} {display.lastName}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p>{display.email || ''}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact</p>
                <p>{display.contact || ''}</p>
              </div>
            </div>
          )}
        </div>
        {!loading && (
          <div className="px-5 pb-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md border border-gray-200 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (display.id) {
                  navigate(`/users/${display.id}`);
                }
              }}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-[11px] font-medium hover:bg-blue-700"
            >
              View full profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoModal;
