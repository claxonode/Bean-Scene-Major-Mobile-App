// const BASE_URL = "https://localhost:7200/"//location
const BASE_URL = "http://10.0.2.2:5240";

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

// async function testGetAllMenuItems() {
//     const menuItems = await getAllMenuItemsByCategory();

//     for (const item of menuItems) {
//         console.log('Menu Details');
//         console.log('Id: ' + item.id);
//         console.log('Name: ' + item.name);
//         console.log('Price: ' + item.description);
//         console.log("Category: "+ item.category)
//     }
// }
// testGetAllMenuItems()
