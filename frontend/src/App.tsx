import { React, FormEvent, useState, useRef, useEffect } from 'react'; 
import * as api from './API';
import { Recipe } from './types';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import { AiOutlineSearch } from "react-icons/ai";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type Tabs = "search" | "favorites";


const App =  () => {


  const [searchTerm, setSearchTerm] = useState ("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  
  //Set tabs
  const pageNumber = useRef(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );

  //Handle form to call when form is sumbitted

  const addFavoriteRecipe = async (recipe: Recipe) => {
      try{
        await api.addFavoriteRecipe(recipe);
        setFavoriteRecipes([...favoriteRecipes, recipe]);
      }
      catch (error) {
        console.error(error);
      }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try{
      await api.removeFavoriteRecipe(recipe);
      const updated_recipes = favoriteRecipes.filter( (favrecipe) => favrecipe.id != recipe.id);
      setFavoriteRecipes(updated_recipes);
    }
    catch(error){
      console.error(error);
    }
  }

  const handleViewMoreClick = async () => {
    try{
      const nextPage = pageNumber.current + 1;
      const nextRecipes = await api.searchReceipes(searchTerm, nextPage);
      setRecipes((prevRecipes) => [...prevRecipes, ...nextRecipes.results]);

      pageNumber.current = nextPage;
    } catch(error){
      console.error(error);
    }

  };

  useEffect ( () => {
    const fetchFavoriteRecipes = async () => {
        try{
          const favoriteRecipes = await api.getFavouriteRecipes();
          setFavoriteRecipes(favoriteRecipes.results);
        }
        catch(error){
          console.error(error);
        }
    };
    fetchFavoriteRecipes();
  }, []);

  const handleSearchSubmit = async (event: FormEvent) => {
      event.preventDefault();

      try{
        const { results } = await api.searchReceipes(searchTerm, 1);
        setRecipes(results);
        pageNumber.current = 1;
        //const response = await fetch('http://localhost:8800/api/recipe/search?searchTerm=${searchTerm}');

        //if (!response.ok){
         // throw new Error('HTTP ERROR ${response.status}'
          //);

      }catch (error){
        console.error(error)
      }
      
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/hero-image.jpg"></img>
        <div className="title">My Recipe App</div>
      </div>
      <div className="tabs">
        <h1
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Recipe Search
        </h1>
        <h1
          className={selectedTab === "favourites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favourites")}
        >
          Favourites
        </h1>
      </div>

      {selectedTab === "search" && (
        <>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              required
              placeholder="Enter a search term ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            ></input>
            <button type="submit">
              <AiOutlineSearch size={40} />
            </button>
          </form>

          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isFavourite = favoriteRecipes.some(
                (favRecipe) => recipe.id === favRecipe.id
              );

              return (
                <RecipeCard
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavouriteButtonClick={
                    isFavourite ? removeFavouriteRecipe : addFavoriteRecipe
                  }
                  isFavourite={isFavourite}
                />
              );
            })}
          </div>

          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favourites" && (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={removeFavouriteRecipe}
              isFavourite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );


  
};

export default App;
