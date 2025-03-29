import styles from "./form.module.css";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function Form({ setResult, setIsLoading, isLoading, result }) {
  const [items, setItems] = useState([]);
  const [textValue, setInputValue] = useState("");
  const [buttonText, setButtonText] = useState("Generate Report");

  const addNewItem = () => {
    if (isLoading) {
      return;
    }
    if (textValue.trim()) {
      setItems([...items, textValue.toUpperCase()]);
      setInputValue("");
    }
  };

  const removeItem = (value) => {
    if (isLoading) {
      return;
    }
    const arr = items.filter((item) => item !== value);
    setItems(arr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (result.trim() != "") {
      setItems([]);
      setInputValue("");
      setButtonText("Generate Report");
      setResult("");
      return;
    }

    if (!items.length) {
      toast.error("Please select your tickers to continue.");
      return;
    }
    setIsLoading(true);
    const newDataSet = [];
    setButtonText("Fetching Data...");

    // Process one ticker at a time
    const fetchInfo = async () => {
      for (const item of items) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/ticker/${item}`
          );
          if (response["data"]["success"]) {
            newDataSet.push(response["data"]["data"]);
          } else {
            setIsLoading(false);
            setButtonText("Generate Report");
            toast.error(`Invalid ticker: ${item}`);
            return;
          }
        } catch (error) {
          setIsLoading(false);
          setButtonText("Generate Report");
          toast.error(`Error processing ticker: ${item}`);
          return;
        }
      }
      const content = {
        query: newDataSet,
      };
      setButtonText("Generating Report...");
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/report",
          content
        );
        if (response["data"]["success"]) {
          setResult(response["data"]["result"]);
        }
        setIsLoading(false);
        setButtonText("Clear Results");
      } catch (error) {
        setIsLoading(false);
        setButtonText("Generate Report");
      }
    };

    fetchInfo();
  };

  return (
    <div className={styles.container}>
      <div className={styles.Intro}>
        <p>AI Stock Analyzer 📈</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <div className={styles.inputBox}>
            <input
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              value={textValue}
              placeholder="MSFT..."
            />
            <input
              type="button"
              value="Add"
              onClick={addNewItem}
              disabled={isLoading}
            />
          </div>
          <SimpleBar style={{ maxHeight: 150 }}>
            <ul>
              {items.map((item, key) => {
                return (
                  <li key={key} onClick={() => removeItem(item)}>
                    {item}
                  </li>
                );
              })}
            </ul>
          </SimpleBar>
        </div>
        <input type="submit" value={buttonText} disabled={isLoading} />
      </form>
    </div>
  );
}
