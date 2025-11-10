import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SurveyForm from "./components/SurveyForm";
import SurveyList from "./components/SurveyList";
import EditSurvey from "./components/EditSurvey";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<SurveyForm />} />
        <Route path="/surveys" element={<SurveyList />} />
<Route path="/edit/:id" element={<EditSurvey />} />      
      </Routes>
    </BrowserRouter>
  );
}
