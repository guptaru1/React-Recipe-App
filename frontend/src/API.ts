import { Recipe } from "./types";

export const searchReceipes = async (searchTerm: string, page: number) => {

    const baseURL = new URL("http://localhost:8900/api/recipe/search");
    baseURL.searchParams.append("searchTerm", searchTerm);
    baseURL.searchParams.append("page", page.toString());

    console.log("what is the base query")
    //Makes an http request to a url and returns a prmoise that resolves to the response object containing the resp to request.
    const response = await fetch(baseURL.toString());

    if (! response.ok){
        throw new Error('HTTP Error: ${response.status}');
    }

    return response.json();
};

export const addFavoriteRecipe = async (recipe: Recipe) => {
  const url = new URL ("http://localhost:8900/api/recipes/favourite");

  const body = {
    recipeId: recipe.id,
  }

  const response = await fetch (url, {
    method : "POST",
    headers : {
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify(body),
  });

  if (!response.ok){
    throw new Error("OOPS something went wronf ${response.status}");
  }

};

export const removeFavoriteRecipe = async (recipe: Recipe) =>{
    const url = new URL ("http://localhost:8900/api/recipes/favourite");

    const body = {
      recipeId: recipe.id,
    };
    const response = await fetch (url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }
};

export const getFavouriteRecipes = async () => {
  const url = new URL("http://localhost:8900/api/recipes/favourite");

  const response = await fetch(url);
  if (!response.ok){
    throw new Error('HTTP Error Status ${response.status}');
  }
  return response.json();
};

export const getRecipeSummary = async (recipeId: string) => {
    const url = new URL(`http://localhost:8900/api/recipes/${recipeId}/summary`);
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    return response.json();
  };

  
// export {searchReceipes};