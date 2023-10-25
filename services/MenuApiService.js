// const BASE_URL = "https://localhost:7200/"//location
const BASE_URL = "http://10.0.2.2:5147";

export async function getAllMenuItems() {
    const finalUrl = new URL('/staff/api/MenuItems',BASE_URL);
    
    const response = await fetch(finalUrl);
    const data = await response.json();
    return data;
}

export async function getAllMenuItemsByCategory() {
    const finalUrl = new URL('/staff/api/MenuItemsByCategory',BASE_URL);
    
    const response = await fetch(finalUrl);
    const data = await response.json();
    return data;
}

async function testGetAllMenuItems() {
    const menuItems = await getAllMovies();

    for (const movie of menuItems) {
        console.log('Movie Details');
        console.log('Id: ' + movie.id);
        console.log('Title: ' + movie.name);
        console.log('Price: ' + movie.description);
        console.log("Category: "+ movie.category)
    }
}
testGetAllMenuItems()
