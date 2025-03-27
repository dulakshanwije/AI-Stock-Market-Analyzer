import "./App.css";
import Form from "./components/Form";
import Description from "./components/Description";
import { useState } from "react";

export default function App() {
  const [result, setResult] = useState("");

  return (
    <div className="container">
      <Form setResult={setResult} />
      <Description content={result} />
    </div>
  );
}
