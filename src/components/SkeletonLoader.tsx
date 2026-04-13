import React from 'react';
export function SkeletonLine({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-[#3A3A3C] rounded-full ${className}`} />);


}
export function SkeletonCircle({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-[#3A3A3C] rounded-full ${className}`} />);


}
export function SkeletonCard({ className = '' }: {className?: string;}) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-[#3A3A3C] rounded-2xl ${className}`} />);


}
export function TransactionSkeleton() {
  return (
    <div className="flex items-center justify-between py-3.5 px-4 bg-white dark:bg-[#2C2C2E] rounded-2xl border border-gray-50 dark:border-[#3A3A3C] mb-2">
      <div className="flex items-center gap-3">
        <SkeletonCard className="w-12 h-12 rounded-2xl" />
        <div className="space-y-2">
          <SkeletonLine className="w-32 h-4" />
          <SkeletonLine className="w-20 h-3" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <SkeletonLine className="w-16 h-5" />
        <SkeletonLine className="w-12 h-3" />
      </div>
    </div>);

}
export function HomePageSkeleton() {
  return (
    <div className="w-full px-6 pt-12 pb-24 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonCircle className="w-12 h-12" />
        <div className="space-y-2">
          <SkeletonLine className="w-24 h-3" />
          <SkeletonLine className="w-32 h-5" />
        </div>
      </div>

      {/* Balance Card */}
      <SkeletonCard className="w-full h-40" />

      {/* Story Card */}
      <SkeletonCard className="w-full h-20" />

      {/* Wallets */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <SkeletonLine className="w-24 h-5" />
          <SkeletonLine className="w-16 h-4" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          <SkeletonCard className="w-[85%] sm:w-[300px] h-44 shrink-0" />
          <SkeletonCard className="w-[85%] sm:w-[300px] h-44 shrink-0" />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <SkeletonLine className="w-32 h-5" />
          <SkeletonLine className="w-16 h-4" />
        </div>
        <div className="bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-2 border border-gray-50 dark:border-[#3A3A3C]">
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </div>
      </div>
    </div>);

}