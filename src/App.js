import React from "react";
import "./App.scss";
import Header from "./components/header";
import Footer from "./components/footer";
import Body from "./containers/body";

function App() {
  return (
    <div className="App">
        <Header />
        <Body />
        <Footer />
    </div>
  );
}

export default App;
