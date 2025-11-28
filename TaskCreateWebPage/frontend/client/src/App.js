import {Route, Routes} from "react-router-dom"
import Home from './pages/Home';


function App() {
  return (
    <Routes>
    
    <Route path="/" element={<Home />} />
  
      {/* 404 */}
      <Route path="*" element={<div>Page Not Found</div>} />
  </Routes>
  );
}

export default App;
