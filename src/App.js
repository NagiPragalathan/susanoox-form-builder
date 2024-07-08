import { Fragment } from "react";
import FormBuilder from "@components/FormBuilder";
import ListForms from "./components/ListForms";
import "react-nestable/dist/styles/index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormBuilder />} />
        <Route path="/form/:id" element={<FormBuilder />} />
        <Route path="/new" element={<ListForms />} />
      </Routes>
    </Router>
  );
};

export default App;
