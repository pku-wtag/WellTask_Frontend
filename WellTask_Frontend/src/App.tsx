import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "@/RoutesComponent";
import { ToasterProvider } from "./components/base-component/toaster";

const App: React.FC = () => {
  return (
    <ToasterProvider>
      <Router>
        <RoutesComponent />
      </Router>
    </ToasterProvider>
  );
};

export default App;
