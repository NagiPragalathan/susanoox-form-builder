import { Fragment } from "react";
import FormBuilder from "@components/FormBuilder";
import ListForms from "./components/ListForms";
import "react-nestable/dist/styles/index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListForms />} />
        <Route path="/form/:id" element={<FormBuilder />} />
      </Routes>
    </Router>
  );
};

export default App;
