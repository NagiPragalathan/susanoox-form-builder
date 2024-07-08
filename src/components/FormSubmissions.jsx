import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FormSubmissions = () => {
  const { formId } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/submissions/${formId}`);
        if (!response.ok) {
          throw new Error(`Error fetching submissions: ${response.statusText}`);
        }
        const result = await response.json();
        console.log("Results: ", result)
        setSubmissions(result);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, [formId]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Form Submissions</h2>
      {submissions.map((submission, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-bold mb-2">Submission {index + 1}</h3>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(submission.filledData, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default FormSubmissions;
