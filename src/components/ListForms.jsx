import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListForms = () => {
  const [forms, setForms] = useState([]);
  const [open, setOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/forms');
        console.log('Fetched forms:', response.data); // Debugging line
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateForm = async () => {
    try {
      const response = await axios.post('http://localhost:5000/saveForm', {
        title: newFormTitle,
        description: '',
        data: []
      });
      setForms([...forms, response.data]);
      handleClose();
      navigate(`/form/${response.data._id}`); // Navigate to the form builder page with the new form ID
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/form/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {forms.map((form) => (
          <div
            key={form._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleCardClick(form._id)}
          >
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">{form.title}</h2>
            <p className="text-gray-600">{form.description}</p>
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-5 shadow-lg hover:bg-blue-700 transition-colors duration-300"
        onClick={handleOpen}
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md">
            <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" onClick={handleClose}>
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create New Form</h2>
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-3 w-full mb-6"
              placeholder="Form Title"
              value={newFormTitle}
              onChange={(e) => setNewFormTitle(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full hover:bg-blue-700 transition-colors duration-300"
              onClick={handleCreateForm}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListForms;
