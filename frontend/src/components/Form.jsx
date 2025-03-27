import styles from "./form.module.css";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import axios from "axios";

export default function Form({ setResult }) {
  const [items, setItems] = useState([]);
  const [textValue, setInputValue] = useState("");
  const [dataSet, setDataSet] = useState([]);

  const addNewItem = () => {
    if (textValue.trim()) {
      setItems([...items, textValue.toUpperCase()]);
      setInputValue("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDataSet = [];

    Promise.all(
      items.map((item, key) =>
        axios
          .get(`http://127.0.0.1:5000/ticker/${item}`)
          .then((response) => {
            if (response["data"]["success"]) {
              newDataSet.push(response["data"]["data"]);
            }
          })
          .catch((error) => {
            console.error(error);
          })
      )
    ).then(() => {
      const content = {
        query: newDataSet,
      };

      axios
        .post("http://127.0.0.1:5000/report", content)
        .then((response) => {
          if (response["data"]["success"]) {
            console.log(response["data"]["result"]);
            setResult(response["data"]["result"]);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
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
            <input type="button" value="Add" onClick={addNewItem} />
          </div>
          <SimpleBar style={{ maxHeight: 150 }}>
            <ul>
              {items.map((item, key) => {
                return <li key={key}>{item}</li>;
              })}
            </ul>
          </SimpleBar>
        </div>
        <input type="submit" value="Generate" />
      </form>
    </div>
  );
}
