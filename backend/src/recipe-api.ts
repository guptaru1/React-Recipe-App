import { URLSearchParams } from "url";

const API_KEY = process.env.API_KEY;


export const getFavoriteRecipesByIds = async(ids: string[]) => {
    if (!API_KEY){
        throw new Error("Invalid API KEY");
    }

    const url = new URL ("https://api.spoonacular.com/recipes/informationBulk");

    url.search = new URLSearchParams({
        apiKey: API_KEY,
        ids: ids.join(",")
    }).toString();

    const response = await fetch(url);
    const json = await response.json();
    return {results: json};

}
export const searchReceipes = async (searchTerm: string, page:number) => {

    if (!API_KEY){
        throw new Error("API key is not found");
    }

    const baseURL = "https://api.spoonacular.com/recipes/complexSearch";
    const url = new URL(baseURL);
   
    const queryParams = {
        apiKey: API_KEY,
        query: searchTerm, 
        number: String(10),
        offset: String((page - 1)* 10),
    };

    //To append the query to the url 
    url.search = new URLSearchParams(queryParams).toString();

    
    try{
        const searchResponse = await fetch(url.toString());
        const responseJson = await searchResponse.json();
      //  console.log("our reseults", responseJson);
        return responseJson;

    }catch (error){
        console.error(error);
    }

}

export const getRecipeSummary = async (receipeId: string) => {

    const url = new URL(
        `https://api.spoonacular.com/recipes/${receipeId}/summary`
      );
    if (!API_KEY){
        throw new Error("API key is not found");
    }
    const params = {
        apiKey: API_KEY,
    };

    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url.toString());
    const response_json = await response.json();
    return response_json;
  


}