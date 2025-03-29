import styles from "./description.module.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Description({ content, isLoading }) {
  return (
    <div className={styles.container}>
      {content.trim() == "" && !isLoading ? (
        <div className={styles.topSkelton}>
          <img src="report.svg" alt="report" width={50} height={50} />
          <p>Please select your favorite tickers to continue.</p>
        </div>
      ) : isLoading ? (
        <SkeletonTheme width="90%">
          <Skeleton
            count={5}
            baseColor="#2a2440"
            highlightColor="#444"
            width="100%"
          />
          <Skeleton
            count={1}
            baseColor="#2a2440"
            highlightColor="#444"
            width="90%"
          />
          <Skeleton
            count={1}
            baseColor="#2a2440"
            highlightColor="#444"
            width="80%"
          />
          <Skeleton
            count={1}
            baseColor="#2a2440"
            highlightColor="#444"
            width="50%"
          />
        </SkeletonTheme>
      ) : (
        <SimpleBar className={styles.SimpleBar}>
          <p>{content}</p>
        </SimpleBar>
      )}
    </div>
  );
}
