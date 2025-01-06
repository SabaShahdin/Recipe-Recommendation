import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleFindRecipes = () => {
    navigate("/ingredients");
  };

  return (
    <div
      className="bg-black text-white min-h-screen flex items-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/assets/2.jpg')", 
        backgroundSize: 'contain', 
        backgroundPosition: 'center',
      }}
    >
      {/* Removed navbar and header content */}
      <div className="text-center p-6 max-w-5xl mx-auto">
        <div className="bg-black bg-opacity-80 rounded-xl p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Your Next Favorite Recipe
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Enter ingredients you have, and let us inspire your next meal!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all"
              onClick={handleFindRecipes}
            >
              Find Recipes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
