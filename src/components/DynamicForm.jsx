import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DynamicForm = () => {
  const { id } = useParams(); // Get the form ID from the URL parameters
  const navigate = useNavigate(); // To navigate after form submission

  const [formData, setFormData] = useState({});
  const [formElements, setFormElements] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getForm/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching form: ${response.statusText}`);
        }
        const form = await response.json();
        setFormElements(form.data);
        setFormTitle(form.title);
        setFormDescription(form.description);
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    };

    fetchForm();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create filled data array with labels and values
      const filledData = formElements.map(element => ({
        label: element.value,
        value: formData[element.id]
      }));
      
      const response = await fetch('http://localhost:5000/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId: id, filledData }),
      });
      if (!response.ok) {
        throw new Error(`Error submitting form: ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Form submitted successfully:', result);
      navigate(`/submission-success`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
      <p className="mb-4">{formDescription}</p>
      {formElements.map((element) => (
        <div key={element.id} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">{element.value}</label>
          {element.type === 'radio' ? (
            element.options.map((option) => (
              <div key={option.id} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={element.id}
                  value={option.value}
                  required={element.required}
                  onChange={handleChange}
                  className="mr-2 leading-tight"
                />
                <label className="text-gray-700">{option.value}</label>
              </div>
            ))
          ) : element.type === 'textarea' ? (
            <textarea
              name={element.id}
              required={element.required}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <input
              type={element.type}
              name={element.id}
              required={element.required}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          )}
        </div>
      ))}
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
