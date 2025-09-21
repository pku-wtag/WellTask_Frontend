import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "@/RoutesComponent";

const App: React.FC = () => {
  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
};

export default App;
