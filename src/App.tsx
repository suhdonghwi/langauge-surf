/** @jsxImportSource theme-ui */
import { useState } from "react";
import { ThemeProvider } from "theme-ui";
import { FaBars } from "react-icons/fa";

import theme from "./theme";
import LanguageNetwork from "./components/LanguageNetwork";
import Sidebox from "./components/Sidebox";
import Layout from "./data/Layout";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [layout, setLayout] = useState<Layout>("force");

  return (
    <ThemeProvider theme={theme}>
      <LanguageNetwork layout={layout} />
      <Sidebox
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        layout={layout}
        onChangeLayout={(l) => setLayout(l)}
      />
      <button
        onClick={() => setShowSidebar(true)}
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: 3,
          left: 0,
          appearance: "none",
          border: "none",
          borderRadius: "0 10px 10px 0",
          boxShadow:
            "0px 8px 17px 2px rgba(0,0,0,0.14) , 0px 3px 14px 2px rgba(0,0,0,0.12) , 0px 5px 5px -3px rgba(0,0,0,0.2) ",
          width: "3.5rem",
          height: "3.5rem",
          backgroundColor: "gray",
          color: "darkGray",
          transition: "all 0.3s",
          "&:hover": {
            backgroundColor: "primary",
            color: "white",
          },
        }}
      >
        <FaBars sx={{ fontSize: 5 }} />
      </button>
    </ThemeProvider>
  );
}

export default App;
