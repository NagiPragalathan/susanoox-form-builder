import React from 'react';

const SubmissionSuccess = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Form Submitted Successfully!</h2>
      <p className="mb-4">Thank you for your submission. We have received your form successfully.</p>
      <div className="flex justify-center">
        <button
          onClick={() => window.history.back()} // Go back to previous page on button click
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
