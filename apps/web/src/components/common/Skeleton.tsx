import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-slate-200/80 animate-pulse rounded-xl ${className}`} />
);

export const ChargerCardSkeleton: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start space-x-3 flex-1">
        <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-16 h-4 rounded-full" />
            <Skeleton className="w-24 h-3.5" />
          </div>
          <Skeleton className="w-3/4 h-5" />
        </div>
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="w-14 h-5 ml-auto" />
        <Skeleton className="w-12 h-3 ml-auto" />
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-16 h-4" />
      <Skeleton className="w-20 h-4" />
    </div>
    <Skeleton className="w-full h-12 rounded-xl" />
  </div>
);

export const ChargerDetailSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-36 h-6 rounded-full" />
        </div>
        <Skeleton className="w-2/3 h-8" />
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-full aspect-16/9 rounded-2xl" />
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <Skeleton className="h-18 rounded-xl" />
          <Skeleton className="h-18 rounded-xl" />
          <Skeleton className="h-18 rounded-xl" />
        </div>
        <Skeleton className="w-full h-16 rounded-2xl" />
      </div>
    </div>
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-full h-10 rounded-xl" />
        <Skeleton className="w-full h-10 rounded-xl" />
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>
    </div>
  </div>
);

export const DashboardCardSkeleton: React.FC = () => (
  <div className="space-y-6 py-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
      <Skeleton className="h-28 rounded-2xl" />
    </div>
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="w-40 h-6" />
        <Skeleton className="w-28 h-8 rounded-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="w-full h-24 rounded-2xl" />
        <Skeleton className="w-full h-24 rounded-2xl" />
      </div>
    </div>
  </div>
);

export const BookingCardSkeleton: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-20 h-5 rounded-full" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-48 h-5" />
      </div>
      <Skeleton className="w-16 h-6 rounded-lg" />
    </div>
    <div className="flex items-center space-x-4 pt-2 border-t border-slate-100">
      <Skeleton className="w-28 h-4" />
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-20 h-8 rounded-xl ml-auto" />
    </div>
  </div>
);
