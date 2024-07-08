import { Fragment } from "react";
import FormBuilder from "@components/FormBuilder";
import ListForms from "./components/ListForms";
import DynamicForm from "./components/DynamicForm";
import SubmissionSuccess from "./components/SubmissionSuccess";
import FormSubmissions from "./components/FormSubmissions";
import "react-nestable/dist/styles/index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListForms />} />
        <Route path="/submission-success" element={<SubmissionSuccess />} />
        <Route path="/preview/:id" element={<DynamicForm />} />
        <Route path="/form/:id" element={<FormBuilder />} />
        <Route path="/submissions/:formId" element={<FormSubmissions />} />
      </Routes>
    </Router>
  );
};

export default App;
