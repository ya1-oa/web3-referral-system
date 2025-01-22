import { useState } from 'react';
import { registerUser } from '../lib/web3/referral';
import { Link, Navigate } from 'react-router-dom';

interface Props {
  userAddress: string;
}

export function ReferralRegistration({ userAddress }: Props) {
  const [referrerAddress, setReferrerAddress] = useState(() => {
    // Initialize with stored referrer address if available
    return localStorage.getItem('referrer') || '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${userAddress}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      alert('Referral link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser(referrerAddress || undefined);
      if (result.success) {
        setSuccess(true);
        localStorage.removeItem('referrer');
      } else {
        setError(result.error ? String(result.error) : 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Register for Referral Program</h2>
      <div className="text-sm mb-4">Your Address: {userAddress}</div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Referrer Address (Optional)
          </label>
          <input
            type="text"
            value={referrerAddress}
            onChange={(e) => setReferrerAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="mt-4 space-y-2">
            <div className="text-green-500 text-sm">
              Successfully registered! Share your referral link:
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={getReferralLink()}
                className="flex-1 p-2 text-sm bg-gray-50 rounded border"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <div className="flex items-center gap-2">
            <div className="text-green-500 text-sm">
              Go to dashboard!
            </div>
            <Link to={`/stats/${userAddress}`}>
              <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  Dashboard
              </button>
            </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}