import styles from "./description.module.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export default function Description({ content = "Trading..." }) {
  return (
    <div className={styles.container}>
      <SimpleBar className={styles.SimpleBar}>
        <p>{content}</p>
      </SimpleBar>
    </div>
  );
}
