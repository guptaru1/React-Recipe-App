import React, { useState, useEffect } from "react";
import { RecipeSummary } from "../types";
import { getRecipeSummary } from "../API";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose } : Props) => {
    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();
    console.log("coming in receipe modal", recipeId);
    useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const summary = await getRecipeSummary(recipeId);
        console.log("the recipe summaryyyyyyyy", summary);
        setRecipeSummary(summary);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecipeSummary();
  }, [recipeId]);

  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipeSummary.title}</h2>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipeSummary.summary }}></p>
        </div>
      </div>
    </>
  );
};


export default RecipeModal;