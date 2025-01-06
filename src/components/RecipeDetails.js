import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const RecipeDetails = () => {
  const location = useLocation();
  const { ingredients, cuisine, meal, prepTime } = location.state;

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alternativeMeals, setAlternativeMeals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [missingIngredients, setMissingIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    // Load favorites from localStorage if available
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);
  
  useEffect(() => {
    // Store favorites in localStorage when they change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const query = ingredients.join(", ");
        const lowerCaseMeal = meal.toLowerCase();
  
        // Fetching the main recipes based on ingredients, cuisine, and meal type
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch`,
          {
            params: {
              query,
              cuisine,
              type: lowerCaseMeal,
              apiKey: "cbbbf096635b48cbb8b9d2e22bc6e41b",
            },
          }
        );
  
        console.log("Fetched recipes response:", response.data); // Log the response data
  
        // Check for valid recipes data
        if (response.data && Array.isArray(response.data.results)) {
          const matchingRecipes = response.data.results.filter((recipe) => {
            const recipeIngredients = recipe.extendedIngredients || [];  // Empty fallback if no ingredients
            if (recipeIngredients.length === 0) {
              console.log(`No ingredients for recipe: ${recipe.title}, but showing the recipe anyway.`);
            }
          
            // Proceed with matching logic
            const matchedIngredients = recipeIngredients.filter((ingredient) =>
              ingredients.includes(ingredient.name)  // Matching based on passed ingredients
            );
          
            console.log(`Matched Ingredients for ${recipe.title}:`, matchedIngredients);
          
            // Display recipe if at least one ingredient matches (or show all if no ingredients)
            return matchedIngredients.length >= 1 || recipeIngredients.length === 0;
          });
          
  
          if (matchingRecipes.length > 0) {
            const detailedRecipes = await Promise.all(
              matchingRecipes.map(async (recipe) => {
                const detailedResponse = await axios.get(
                  `https://api.spoonacular.com/recipes/${recipe.id}/information`,
                  {
                    params: {
                      apiKey: "cbbbf096635b48cbb8b9d2e22bc6e41b",
                    },
                  }
                );
                return detailedResponse.data;
              })
            );
  
            setRecipes(detailedRecipes); // Set main recipes
          } else {
            // If no matching recipes, show alternative meals
            console.log("No matching recipes found, fetching alternatives..."); // Log when no recipes match
  
            const alternativeResponse = await axios.get(
              `https://api.spoonacular.com/recipes/complexSearch`,
              {
                params: {
                  type: lowerCaseMeal,
                  number: 3, // Show only 3 alternatives
                  apiKey: "cbbbf096635b48cbb8b9d2e22bc6e41b",
                },
              }
            );
  
            console.log("Alternative meals response:", alternativeResponse.data); // Log alternative meals response
  
            const alternativeMealsWithDetails = await Promise.all(
              alternativeResponse.data.results.map(async (meal) => {
                const mealDetailsResponse = await axios.get(
                  `https://api.spoonacular.com/recipes/${meal.id}/information`,
                  {
                    params: {
                      apiKey: "cbbbf096635b48cbb8b9d2e22bc6e41b",
                    },
                  }
                );
                return { ...mealDetailsResponse.data, showIngredients: false };
              })
            );
  
            setAlternativeMeals(alternativeMealsWithDetails);
            setError(
              <div className="p-4 mb-6 text-center text-orange-500">
                <p className="font-semibold text-4xl">No Recipes Found.</p>
                <p className="text-2xl">We can show you alternative dishes.</p>
              </div>
            );
          }
        }
        setLoading(false);
      } catch (err) {
        setError(
          `Error fetching recipes: ${err.response ? err.response.data.message : err.message}`
        );
        setLoading(false);
      }
    };
  
    fetchRecipes();
  }, [ingredients, cuisine, meal, prepTime]);
  
  const toggleFavorite = (recipe) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === recipe.id);
      if (isFavorite) {
        return prevFavorites.filter((fav) => fav.id !== recipe.id);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };
  

  const toggleIngredients = (recipeId, isAlternative = false) => {
    if (isAlternative) {
      setAlternativeMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === recipeId
            ? { ...meal, showIngredients: !meal.showIngredients }
            : meal
        )
      );
    } else {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, showIngredients: !recipe.showIngredients }
            : recipe
        )
      );
    }
  };

  const generateShoppingList = (recipe) => {
    const userIngredientsSet = new Set(ingredients);
    const missing = recipe.extendedIngredients.filter(
      (ingredient) => !userIngredientsSet.has(ingredient.name)
    );
    setMissingIngredients(missing);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMissingIngredients([]);
  };

  const renderRecipeCard = (recipe, isAlternative = false) => (
    <div
      key={recipe.id}
      className="w-64 m-4 p-4 bg-transparent border border-gray-300 rounded-lg shadow-md text-center"
    >
      <h4 className="text-xl font-semibold text-orange-600">{recipe.title}</h4>
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover rounded-lg"
      />
      {recipe.showIngredients && (
        <div>
          <h5 className="my-2 text-orange-500 text-2xl">Ingredients:</h5>
          <ul className="list-none text-lg text-orange-500">
            {recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.name} - {ingredient.amount} {ingredient.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={() => toggleIngredients(recipe.id, isAlternative)}
          className="px-4 py-2 bg-black text-orange-500 rounded-md mb-2 transition duration-300 hover:bg-orange-500 hover:text-black hover:scale-105"
        >
          {recipe.showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>
        <button
          onClick={() => generateShoppingList(recipe)}
          className="px-4 py-2 bg-black text-orange-500 rounded-md mb-2 transition duration-300 hover:bg-orange-500 hover:text-black hover:scale-105"
        >
          Generate Shopping List
        </button>
        <button
          onClick={() => toggleFavorite(recipe)}
          className={`px-4 py-2 rounded-md text-orange-500 transition duration-300 hover:scale-105 ${favorites.some((fav) => fav.id === recipe.id)
              ? "bg-red-600 hover:bg-orange-500 hover:text-black  text-black"
              : "bg-black hover:bg-orange-500 hover:text-black"
            }`}
        >
          {favorites.some((fav) => fav.id === recipe.id)
            ? "Unfavorite"
            : "Favorite"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url(/assets/4.jpg)', backgroundOpacity: 0.5 }}>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div>
          {/* Box for Ingredients, Cuisine, Meal, and Prep Time */}
          <div className="mb-6 mt-20 p-5 bg-orange-600 rounded-lg shadow-lg text-black text-xl flex flex-col items-center space-y-4">
            <h1><strong>Recipe Detail</strong></h1>
            <p><strong>Ingredients:</strong> {ingredients.join(", ")}</p>
            <p><strong>Cuisine Type:</strong> {cuisine}</p>
            <p><strong>Meal Type:</strong> {meal}</p>
            <p><strong>Preparation Time:</strong> {prepTime === "quick" ? "Under 30 minutes" : "Any"}</p>
          </div>

          {/* Recipes fetched from Spoonacular */}
          <div className="ml-8">
            {loading ? (
              <p className="text-2xl text-orange-600 font-medium animate-pulse mt-4">Loading recipes...</p>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-orange-500 mb-4">Recommended Recipes</h3>
                <div className="flex flex-wrap justify-center">
                  {recipes.map((recipe) => renderRecipeCard(recipe))}
                </div>
              </div>
            )}

            {alternativeMeals.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-orange-500 mb-4">Alternative Meals</h3>
                <div className="flex flex-wrap justify-center">
                  {alternativeMeals.map((meal) => renderRecipeCard(meal, true))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
    <h3 className="text-4xl font-semibold text-orange-500 mb-4 text-center">Your Favorite Recipes</h3>
    {favorites.length > 0 ? (
      <div className="flex flex-wrap justify-center">
        {favorites.map((recipe) => (
          <div key={recipe.id} className="w-64 m-4 p-4 bg-transparent border border-gray-300 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-orange-600">{recipe.title}</h4>
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => toggleFavorite(recipe)}
              className="px-4 py-2 rounded-md text-orange-500 transition duration-300 hover:scale-105 bg-black hover:bg-orange-500 hover:text-black"
            >
              Unfavorite
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-orange-600">You haven't added any recipes to your favorites yet.</p>
    )}
  </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black text-orange-500 p-6 rounded-lg w-80">
            <h3 className="text-center text-xl font-semibold mb-4">Missing Ingredients</h3>
            <ul className="list-none mb-4">
              {missingIngredients.map((ingredient) => (
                <li key={ingredient.id} className="text-2xl text-orange-600">
                  {ingredient.name} - {ingredient.amount} {ingredient.unit}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-orange-500 text-black rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
