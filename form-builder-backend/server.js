const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://nagi:nagi@cluster0.ohv5gsc.mongodb.net/forms?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const FormSchema = new mongoose.Schema({
  title: String,
  description: String,
  data: Array,
});

const Form = mongoose.model('Form', FormSchema);

app.post('/saveForm', async (req, res) => {
  const { id, title, description, data } = req.body;
  console.log('Received form data:', { id, title, description, data });

  try {
    let form;
    if (id) {
      form = await Form.findByIdAndUpdate(id, { title, description, data }, { new: true, upsert: true });
    } else {
      form = new Form({ title, description, data });
      await form.save();
    }

    console.log('Form saved successfully:', form);
    res.status(201).json({ message: 'Form saved successfully!', formId: form._id });
  } catch (error) {
    console.error('Error saving form:', error);
    res.status(500).json({ message: 'Error saving form', error });
  }
});

app.get('/getForm/:id', async (req, res) => {
  console.log('Fetching form with ID:', req.params.id);
  try {
    const form = await Form.findById(req.params.id);
    if (form) {
      console.log('Form retrieved successfully:', form);
      res.status(200).json(form);
    } else {
      console.log('Form not found with ID:', req.params.id);
      res.status(404).json({ message: 'Form not found' });
    }
  } catch (error) {
    console.error('Error retrieving form:', error);
    res.status(500).json({ message: 'Error retrieving form', error });
  }
});

app.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find({});
    res.status(200).json(forms);
  } catch (error) {
    console.error('Error retrieving forms:', error);
    res.status(500).json({ message: 'Error retrieving forms', error });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
