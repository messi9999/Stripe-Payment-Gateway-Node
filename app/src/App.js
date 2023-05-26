import "./App.css";
import { Routes, Route } from "react-router-dom";
import Payment from "./component/Payment";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App;
