import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const useQuery = () => new URLSearchParams(useLocation().search);

const GroupInvite = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get('token') || '';
  const action = (query.get('action') || 'accept').toLowerCase();

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Processing your invite...');
  const hasRunRef = useRef(false);

  useEffect(() => {
    const handleInvite = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invite link is invalid or missing.');
        return;
      }

      const endpoint = action === 'decline' ? '/invites/decline' : '/invites/accept';
      try {
        await axiosClient.post(endpoint, { token });
        if (action === 'decline') {
          setStatus('success');
          setMessage('You have declined this group invite.');
          toast.success('Invite declined');
        } else {
          setStatus('success');
          setMessage('You have joined the group successfully.');
          toast.success('You have joined the group');
        }
      } catch (err) {
        console.error('Failed to process invite', err);
        setStatus('error');
        const msg = err.response?.data?.message || 'Invite link is invalid or has expired.';
        setMessage(msg);
        toast.error(msg);
      }
    };

    if (hasRunRef.current) return;
    hasRunRef.current = true;
    handleInvite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, action]);

  const isError = status === 'error';

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-8 text-center">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          {action === 'decline' ? 'Respond to group invite' : 'Joining group'}
        </h1>
        <p className={`text-xs mb-4 ${isError ? 'text-red-500' : 'text-gray-600'}`}>{message}</p>
        <div className="mt-4 flex justify-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            Go to dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupInvite;
