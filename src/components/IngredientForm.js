import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeFinder = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [cuisineType, setCuisineType] = useState("");
  const [mealType, setMealType] = useState("");
  const [prepTime, setPrepTime] = useState("all");

  const navigate = useNavigate();

  const builtInIngredients = [
    "Tomato", "Potato", "Onion", "Garlic", "Carrot", "Spinach", "Cheese",
    "Chicken", "Fish", "Rice", "Beans", "Pasta"
  ];

  const mealTypes = [
    "Main Course", "Side Dish", "Dessert", 
    "Breakfast",
    "Snack"
  ];

  const handleIngredientClick = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient) ? prev : [...prev, ingredient]
    );
  };

  const handleCuisineClick = (cuisine) => {
    setCuisineType(cuisine);
  };

  const handleMealClick = (meal) => {
    setMealType(meal);
  };

  const handleCustomIngredientAdd = (event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      setSelectedIngredients((prev) => [...prev, event.target.value.trim()]);
      event.target.value = "";
    }
  };

  const handlePrepTimeChange = (event) => {
    setPrepTime(event.target.value);
  };

  const handleSubmit = () => {
    navigate("/recipe-details", {
      state: {
        ingredients: selectedIngredients,
        cuisine: cuisineType,
        meal: mealType,
        prepTime: prepTime,
      },
    });
  };

  const cuisineList = [
    "Asian", "Chinese", "Indian",  "Italian", "Korean",  "Thai" 
  ];

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url(/assets/2.jpg)', backgroundOpacity: 0.5 }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex justify-center items-center p-12">
        <div className="bg-opacity-80 rounded-xl shadow-lg max-w-4xl w-full p-8 transform transition-all hover:scale-105 duration-500">
          <h3 className="text-3xl font-semibold mb-6 text-center text-orange-500">Find Your Recipe</h3>

          {/* Custom Ingredient Input */}
          <div className="mb-8">
            <h4 className="text-xl font-medium mb-4 text-orange-500">Add Ingredients:</h4>
            <input
              type="text"
              placeholder="Enter ingredient and press Enter"
              onKeyDown={handleCustomIngredientAdd}
              className="p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Built-in Ingredients */}
          <div className="mb-8">
            <h4 className="text-xl font-medium mb-4 text-orange-500">Quick Add Ingredients:</h4>
            <div className="flex flex-wrap gap-6">
              {builtInIngredients.map((ingredient, index) => (
                <button
                  key={index}
                  onClick={() => handleIngredientClick(ingredient)}
                  disabled={selectedIngredients.includes(ingredient)}
                  className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform ${
                    selectedIngredients.includes(ingredient)
                      ? "bg-black text-orange-500 border-2 border-orange-500 cursor-not-allowed"
                      : "bg-orange-600 text-white hover:bg-transparent hover:border-2 hover:border-orange-500 hover:text-orange-500 hover:scale-105"
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Types */}
          <div className="mb-8">
            <h4 className="text-xl font-medium mb-4 text-orange-500">Choose Cuisine Type:</h4>
            <div className="flex flex-wrap gap-6">
              {cuisineList.map((cuisine, index) => (
                <button
                  key={index}
                  onClick={() => handleCuisineClick(cuisine)}
                  className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform ${
                    cuisineType === cuisine
                      ? "bg-black text-orange-500 border-2 border-orange-500"
                      : "bg-orange-600 text-white hover:bg-transparent hover:border-2 hover:border-orange-500 hover:text-orange-500 hover:scale-105"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Types */}
          <div className="mb-8">
            <h4 className="text-xl font-medium mb-4 text-orange-500">Choose Meal Type:</h4>
            <div className="flex flex-wrap gap-6">
              {mealTypes.map((meal, index) => (
                <button
                  key={index}
                  onClick={() => handleMealClick(meal)}
                  className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform ${
                    mealType === meal ? "bg-black text-orange-500 border-2 border-orange-500" : "bg-orange-600 text-white hover:bg-transparent hover:border-2 hover:border-orange-400 hover:text-orange-500 hover:scale-105"
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>

{/* Preparation Time Filter */}
<div className="mb-8">
  <h4 className="text-2xl font-large mb-4 text-orange-500">Choose Preparation Time:</h4>
  <div className="flex items-center gap-8">
    <label className="flex items-center gap-3 text-orange-500 hover:text-white transition-all duration-200 text-lg">
      <input
        type="radio"
        value="all"
        checked={prepTime === "all"}
        onChange={handlePrepTimeChange}
        className="form-radio bg-black border-2 border-orange-500 text-orange-600 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
      />
      Any
    </label>
    <label className="flex items-center gap-3 text-orange-500 hover:text-white transition-all duration-200 text-lg">
      <input
        type="radio"
        value="quick"
        checked={prepTime === "quick"}
        onChange={handlePrepTimeChange}
        className="form-radio bg-black border-2 border-orange-500 text-orange-600 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
      />
      Quick (under 30 minutes)
    </label>
  </div>
</div>



          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg  hover:border-2 hover:border-orange-400 hover:text-orange-500  hover:bg-black hover:scale-105 transition-all duration-300"
            >
              Get Recipes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeFinder;
