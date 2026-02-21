import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const MemberProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosClient.get(`/users/${userId}`);
        setUser(res.data);
      } catch (e) {
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = ((user.firstName?.[0] || '') + (user.lastName?.[0] || '') || (user.email?.[0] || '?')).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100 text-blue-600 font-semibold text-xl">
          {user.pfpUrl ? (
            <img src={user.pfpUrl} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          {user.email && <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>}
        </div>
      </div>

      <div className="space-y-4 text-sm text-gray-800">
        <div>
          <p className="text-xs text-gray-500">Contact</p>
          <p>{user.contact || ''}</p>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
