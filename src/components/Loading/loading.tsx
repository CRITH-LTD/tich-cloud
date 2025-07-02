import React from 'react';

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-blue-600">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-opacity-50"></div>
      <p className="mt-4 text-lg font-medium">Loading, please wait...</p>
    </div>
  );
};
