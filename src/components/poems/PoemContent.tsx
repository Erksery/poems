import type { ReactNode } from "react";
import styles from "./index.module.scss";

interface PoemContentProps {
  children: ReactNode;
}

export const PoemContent = ({ children }: PoemContentProps) => {
  return (
    <div className={styles.content_container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
