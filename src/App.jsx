import { Home } from "./pages/home"
import { Shop } from "./pages/shop"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./Layout"
import React, { useState } from "react";

function App() {

    const [totalEffort, setTotalEffort] = useState(0);
    
    return (
    <Router>
        <Routes>
            <Route element = {<Layout/>}>
                <Route path="/" element = {<Home totalEffort={totalEffort} setTotalEffort={setTotalEffort}/>}/>
                <Route path="/shop" element = {<Shop totalEffort={totalEffort} setTotalEffort={setTotalEffort}/>}/>
            </Route>
        </Routes>
    </Router>
    )
  
}

export default App
