import { apiFetch } from "../ui/components.js";

const BASE_URL = "https://nutriplan-api.vercel.app/api/meals";
const API_KEY = "6ajw3JxQoq2peYKM6B1x4veaBaphuRAiOdgQj4SG";

// Search Meals
export async function searchMeals(query = "") {
    const res=await fetch(`${BASE_URL}/search?q=${query}&page=1&limit=25`)
    return res.json() ;
}

// Filter by Category
export async function filterMealByCategory(category) {
    return apiFetch(`${BASE_URL}/filter?category=${category}&page=1&limit=25`);
}

// Filter by Area
export async function filterMealByArea(area) {
    return apiFetch(`${BASE_URL}/filter?area=${area}&page=1&limit=25`);
}

// Get All Categories
export async function getAllCat() {
    return apiFetch(`${BASE_URL}/categories`);
}

// Search Nutrition Data
export async function searchFood(query) {
    return apiFetch(`https://nutriplan-api.vercel.app/api/nutrition/search?q=${query}&page=1&limit=1`, {
        headers: { "x-api-key": API_KEY },
    });
}

// Get Nutrition by Food ID
export async function getNutritionByFoodId(foodId) {
    return apiFetch(`https://nutriplan-api.vercel.app/api/nutrition/food/${foodId}`, {
        headers: { "x-api-key": API_KEY },
    });
}
// analyze nutrition
export async function analyzeRecipe(title, ingredients) {
    const body = {
        title,
        ingredients
    };

    return apiFetch('https://nutriplan-api.vercel.app/api/nutrition/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify(body)
    });
}

// Get Meal by ID
export async function getMealById(id) {
    return apiFetch(`${BASE_URL}/${id}`);
}

// Get Areas
export async function getAreas() {
    return apiFetch(`${BASE_URL}/areas`);
}




export async function searchProducts(query = '') {
    return apiFetch(`https://nutriplan-api.vercel.app/api/products/search?q=${query}&page=1&limit=24`)
}

export async function getProductByBarCode(barcode){
    return apiFetch(`https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`)
}