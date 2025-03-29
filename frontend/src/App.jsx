import "./App.css";
import Form from "./components/Form";
import Description from "./components/Description";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [fillContent, setFillContent] = useState(result.trim() != "");

  return (
    <div className="container">
      <Form
        setResult={setResult}
        result={result}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        // fillContent={fillContent}
      />
      <Description content={result} isLoading={isLoading} />
      <ToastContainer />
    </div>
  );
}
