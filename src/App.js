import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecipeFinder  from './components/IngredientForm';
import RecipeDetails from "./components/RecipeDetails";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ingredients" element={<RecipeFinder />} />
          <Route path="/recipe-details" element={<RecipeDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
