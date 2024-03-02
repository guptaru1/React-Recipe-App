require('dotenv').config();

import express from "express"
import cors from "cors"
import * as RecipeAPI from "./recipe-api";
import {PrismaClient} from "@prisma/client";


const bodyParser = require('body-parser');
const prisam = new PrismaClient();

const app = express()
app.use(bodyParser.json());

//handle json
app.use(express.json())
app.use(cors())


app.get("/api/recipes/favourite", async(req, res) => {
  
        try {
            //Get all the fav recipes
            console.log("ALL THE FAV RECIPES ARE COMING, ADI I MISS YOU");
            const favoriteRecipes = await prisam.favoriteRecipe.findMany();
            const recipesIds = favoriteRecipes.map((recipe) => recipe.recipeId.toString());
            console.log(recipesIds);
            const favorites = await RecipeAPI.getFavoriteRecipesByIds(recipesIds);
            res.json(favorites);

        }
        catch(error){
            console.error(error);
            res.status(500).json({error: "Oops, something went wrong"});
        }
});

app.delete("/api/recipes/favourite", async(req,res) => {
    const {receipeId} = req.body;
    const recipeId = receipeId;


    try{
       
        await prisam.favoriteRecipe.delete({
            where: {recipeId},
        });
        res.status(204).send();
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Oops, something went wrong"});
    }
});

app.post("/api/recipes/favourite", async(req, res) => {
    
    const {recipeId} = req.query ;
   // const data = { recipeId: '655698' };
   // const recipeId = parseInt(data.recipeId, 10);
    //const recipeId_int = parseInt(recipeId, 10);
    console.log("wahts my id", recipeId);
   
    try {
        if (typeof recipeId === 'number') {
            // Use recipeId_int as a number
            const favoriteRecipe = await prisam.favoriteRecipe.create({
                data : {
                    recipeId: recipeId,
                },
        });
        res.status(201).json(favoriteRecipe);
       } 
    }
    catch(error){
        console.error(error);
        res.status(500).json({error: "Oops, something went wrong."});
    }
});


app.get("/api/recipe/search", async(req, res) => {
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);

    const results = await RecipeAPI.searchReceipes(searchTerm, page);
    
    console.log(results);
    return res.json(results);
    
});

app.get("/api/recipe/summary", async(req, res) => {
    console.log("whats happening ");
    const receipeId = req.query.receipeId as string
    console.log("the recipe", receipeId);
    const result = await RecipeAPI.getRecipeSummary(receipeId);
    return res.json(result);

});

app.listen(8900, () => {
    console.log("Server is running");
})
