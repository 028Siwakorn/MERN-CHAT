import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import Layout from '../components/Layout';

export default function Profile() {
  const { user, checkAuth } = useAuth();
  const [fullname, setFullname] = useState(user?.fullname || '');

  useEffect(() => {
    if (user?.fullname) setFullname(user.fullname);
  }, [user?.fullname]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFullnameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/user/update-profile', { fullname });
      await checkAuth();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        await api.put('/user/update-profile', { fullname: user?.fullname, profilePicture: base64 });
        await checkAuth();
        toast.success('Photo updated successfully!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update photo');
    } finally {
      setLoading(false);
    }
    e.target.value = '';
  };

  const memberSince = user?.memberSince || user?.createdAt
    ? new Date(user.memberSince || user.createdAt).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '—';
  const status = user?.status || 'active';

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body">
            <h1 className="text-2xl font-bold text-base-content text-center">Profile</h1>
            <p className="text-base-content/70 text-center mb-6">Your profile information</p>

            {/* Profile picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 ring-2 ring-base-300">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.fullname} />
                    ) : (
                      <span className="text-3xl">
                        {(user?.fullname || '?')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="absolute bottom-0 right-0 btn btn-primary btn-circle btn-sm"
                  aria-label="Update photo"
                >
                  <CameraIcon />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <p className="text-sm text-base-content/60 mt-2">
                Click the camera icon to update your photo
              </p>
            </div>

            <form onSubmit={handleFullnameSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <PersonIcon />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-base-100"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <EnvelopeIcon />
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-base-100"
                  value={user?.email || ''}
                  disabled
                  readOnly
                />
                <p className="text-xs text-base-content/50 mt-1">Email cannot be changed</p>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading || fullname === user?.fullname}
              >
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </form>

            {/* Account information */}
            <div className="divider">Account Information</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Member Since</span>
                <span className="font-medium">{memberSince}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">Account Status</span>
                <span
                  className={`badge ${
                    status === 'active' ? 'badge-success' : status === 'suspended' ? 'badge-error' : 'badge-warning'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PersonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
    </svg>
  );
}
