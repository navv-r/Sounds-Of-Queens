import { useEffect, useState } from "react";
import "./PageWrapper.css";

export default function PageWrapper({ children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`page-wrapper${visible ? " page-wrapper--in" : ""}`}>
      {children}
    </div>
  );
}
