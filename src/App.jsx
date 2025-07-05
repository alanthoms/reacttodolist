import { Home } from "./pages/home"
import { Shop } from "./pages/shop"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
function App() {
  
    
    return (
    <Router>
        <Routes>
            <Route path="/" element = {<Home/>}/>
            <Route path="/shop" element = {<Shop/>}/>
        </Routes>
    </Router>
    )
  
}

export default App
