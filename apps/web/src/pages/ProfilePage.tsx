import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Car, Zap, Phone, Mail, Shield, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services';
import { Vehicle } from '../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
      return;
    }
    vehicleService.list().then(setVehicles).catch(() => {});
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <User className="w-6 h-6 text-emerald-500" />
          <span>My Profile & Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials, role permissions, and vehicle configurations.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-2xl flex items-center justify-center">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {user.role}
              </span>
              <span className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center space-x-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Email Address</span>
              <span className="font-semibold text-slate-800">{user.email}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center space-x-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Mobile Phone</span>
              <span className="font-semibold text-slate-800">{user.phone_number || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-slate-900">Your Vehicles</h3>
          </div>
          <Link
            to="/onboarding/vehicle"
            className="flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vehicle</span>
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <p className="text-xs text-slate-400">No vehicles registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicles.map((v) => (
              <div key={v.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-900">{v.make} {v.model}</span>
                <div className="text-slate-500 text-[11px]">Connectors: {v.connector_types.join(', ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-between items-center">
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="text-xs font-bold text-rose-600 hover:underline"
        >
          Sign Out of Account
        </button>
      </div>
    </div>
  );
};
