"use strict";

function showPlanningAction() {
    document.title = "Planning";

    addClass();
    $("#planning-container").removeClass("hide");
}

function showShoppingListAction() {
    document.title = "List";
    addClass();
    $("#list-container").removeClass("hide");
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementsByClassName("btn")[0].addEventListener("click", showPlanningAction);
    //document.getElementsByClassName("btn")[1].addEventListener("click", showPlanningAction);
});

/**
 * @param {Recipe} recipe
 * @param {*} units
 * @param {Object<string, IngredientData>} ingredientsData
 * @returns {Function} La fonction qui exécute les instructions de showRecipeAction et appelle fillRecipe
 */
function getShowRecipeAction(recipe, units, ingredientsData) {
    return function () {
        document.title = "Recipe";

        addClass();
        $("#recipe-container").removeClass("hide");

        fillRecipe(recipe, units, ingredientsData);
    };
}

function addClass() {
    $("#recipe-container").addClass("hide");
    $("#list-container").addClass("hide");
    $("#planning-container").addClass("hide");
}
