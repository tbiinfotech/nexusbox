import React from "react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mb-4">
          You are not authorized to access this page.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <a href="/Login">Go to Login</a>
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
