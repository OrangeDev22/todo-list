import React from "react";
import "./App.css";
import LoginSignup from "./pages/LoginSignup";

function App() {
  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-grow flex flex-col">
        <LoginSignup />
      </main>
    </div>
  );
}

export default App;
