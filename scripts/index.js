"use strict";

fetch("https://git.esi-bru.be/api/v4/projects/40922/repository/files/recipes-it3.json/raw")
    .then((response) => response.json())
    .then(loadCards)
    .catch(alert);

/**
 * @typedef data
 * @type {object}
  * @property {Object<string, string>} units Description des unitÃ©s utilisÃ©es dans les recettes.
 * @property {Object<string, string>} categories Description des catÃ©gories relatives aux ingrÃ©dients.
 * @property {Object<string, string>} intakes Description des apports nutritionnels.
 * @property {Object<string, IngredientData>} ingredientsData
 * @property {Recipe[]} recipes La liste des recettes.
 */

/**
 * @typedef {Object} IngredientData Description d'un ingrÃ©dient.
 * @property {string} fr Nom de l'ingrÃ©dient en franÃ§ais.
 * @property {string} category CatÃ©gorie de l'ingrÃ©dient.
 * @property {Supplie[]} intakes Apports nutritionnels de l'ingrÃ©dient.
 */

/**
 * @typedef {Object} Recipe Description d'une recette.
 * @property {string} recipeName Nom de la recette.
 * @property {string} imageLink Lien vers une image reprÃ©sentant la recette.
 * @property {string} link Lien vers la source de la recette.
 * @property {number} qp Nombre de personnes comptÃ©es pour la quantitÃ© d'ingrÃ©dients.
 * @property {Array<Ingredient | IngredientWithQuantity>} ingredients Liste des ingrÃ©dients nÃ©cessaires Ã  la recette.
 * @property {string[]} steps Marche Ã  suivre pour rÃ©aliser la recette.
 */

/**
 * @typedef {"proteins" | "starches" | "vegetables"} Supplie Apports nutritionnels existants.
 */

/**
 * @typedef {Object} Ingredient IngrÃ©dient d'une recette sans quantitÃ© prÃ©cise.
 * @property {string} ingredientName Nom de l'ingrÃ©dient.
 */

/**
 * @typedef {Object} IngredientWithQuantity IngrÃ©dient d'une recette avec une quantitÃ©.
 * @property {string} ingredientName Nom de l'ingrÃ©dient.
 * @property {number} quantity QuantitÃ© de l'ingrÃ©dient nÃ©cessaire Ã  la recette.
 * @property {string} unit UnitÃ© de mesure de la quantitÃ©.
 */

/**
 * @param {data} data
 **/

function loadCards(data) {
    const template = /** @type{HTMLTemplateElement} */ (document.getElementById("card"));
    $(".big_div").html("");

    data.recipes.forEach((recipe) => {
        const clone = /** @type{HTMLDivElement} */ (template.content.cloneNode(true));

        $(".fiche > img", clone).attr("src", recipe.imageLink);
        $("h2", clone).text(recipe.recipeName);

        const button_apport = $(clone).find(".btp-apport");
        button_apport.html("");
        const processedIntakes = new Set();

        recipe.ingredients.forEach((ingredient) => {
            const apport = ingredient.ingredientName;
            const supplie = data.ingredientsData[apport];
            const intake = supplie.intakes.toString();

            if (!processedIntakes.has(intake)) {
                processedIntakes.add(intake);

                if (intake === "starches") {
                    button_apport.append(
                        $("<span>").addClass("btn-fecul")
                            .text("FECULENT")
                    );
                } else if (intake === "vegetables") {
                    button_apport.append(
                        $("<span>").addClass("btn-leg")
                            .text("LEGUME")
                    );
                } else if (intake === "proteins") {
                    button_apport.append(
                        $("<span>").addClass("btn-prot")
                            .text("PROTEINE")
                    );
                }
            }
        });
        $(".btn-info", clone).on("click", () => getShowRecipeAction(recipe, data.units, data.ingredientsData)()); 0
        $(".big_div").append(clone);
    });
    $(".btn-calendar").on("click", handleClick);
    $(".dayScheduled").on("click", daySelected);
    $(".btn_selection").on("click", removePlat);
}

function handleClick(event) {
    const btn = event.currentTarget;
    const fiches = document.querySelectorAll(".fiche");

    for (const fiche of fiches) {
        fiche.classList.remove("selected");
    }

    const ficheBtn = btn.parentNode.parentNode;

    $(ficheBtn).addClass("selected");
}

/**
 * @param {Recipe} recipe
 * @param {*} units
 * @param {Object<string, IngredientData>} ingredientsData
 */
function fillRecipe(recipe, units, ingredientsData) {
    const recipe_conatiner = $("#recipe-container");
    $("h1", recipe_conatiner).text(recipe.recipeName);
    $(".photo_recette > img", recipe_conatiner).attr("src", recipe.imageLink);
    $(".photo_recette > img", recipe_conatiner).attr("alt", recipe.imageLink);
    //vider pour les remplir avec les bonnes données
    $(".etape").html("");
    $(".ingredient").html("");

    recipe.steps.forEach((step) => {
        $(".etape").append($("<li>").text(step));
    });

    recipe.ingredients.forEach((ingredient) => {
        if (Object.keys(ingredient).length === 1) {
            $(".ingredient").append($("<li>")
                .text(`${ingredientsData[ingredient.ingredientName].fr}`));
        } else {
            $(".ingredient").append($("<li>")
                .text(`${ingredient.quantity} ${ingredient.unit} ${ingredientsData[ingredient.ingredientName].fr}`));
        }
    });
}

function daySelected() {
    const joursHaut = document.querySelectorAll(".div_haut");
    const joursBas = document.querySelectorAll(".div_bas");

    for (const jourH of joursHaut) {
        jourH.classList.remove("scheduled");
    }
    $(this).closest(".div_haut")
        .addClass("scheduled");

    for (const jourB of joursBas) {
        jourB.classList.remove("scheduled");
    }
    $(this).closest(".div_bas")
        .addClass("scheduled");
    addPlat();
}

function addPlat() {
    const platSelected = document.querySelector(".fiche.selected");
    const jourSelectedH = document.querySelector(".div_haut.scheduled");

    if (platSelected) {
        const platName = platSelected.querySelector("h2")?.textContent;
        if (jourSelectedH) {
            const listPlatH = jourSelectedH.querySelector("ul.listePlat");
            const liPlat = document.createElement("li");
            const btnPlat = document.createElement("button");
            btnPlat.textContent = platName;
            liPlat.append(btnPlat);
            listPlatH?.appendChild(liPlat);
            btnPlat.classList.add("btn_selection");
        }
    }

    const jourSelectedB = document.querySelector(".div_bas.scheduled");

    if (platSelected) {
        const platName = platSelected.querySelector("h2")?.textContent;
        if (jourSelectedB) {
            const listPlatB = jourSelectedB.querySelector("ul.listePlat");
            const liPlat = document.createElement("li");
            const btnPlat = document.createElement("button");
            btnPlat.textContent = platName;
            liPlat.append(btnPlat);
            listPlatB?.appendChild(liPlat);
            btnPlat.classList.add("btn_selection");
        }
    }
}

function removePlat(event) {
    const btn = event.target;
    const btnPlat = document.querySelector(".btn_selection");

    if (btn.classList.contains(btnPlat)) {
        const li = btn.closest("li");
        if (li) {
            li.remove();
        }
    }
    btnPlat?.classList.remove("btn_selection");
}
