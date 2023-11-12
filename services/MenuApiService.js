import { getToken } from "./TokenStorage";
const BASE_URL = "http://10.0.2.2:5240";



export async function getAllMenuItems() {
    const finalUrl = new URL('api/menuItems/', BASE_URL)
    const token = await getToken();
    try {
        const response = await fetch(finalUrl,{
            method:'GET',
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;
      }
}

export async function getMenuCategories() {
  const finalUrl = new URL('api/menuItems/categories',BASE_URL)
  const token = await getToken();
  try {
    const response = await fetch(finalUrl,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
    throw error;
  }
}


export async function getAllMenuItemsByCategory() {
    const finalUrl = new URL('api/menuItems/asSectionData', BASE_URL)
    const token = await getToken();
    try {
        const response = await fetch(finalUrl,{
            method:'GET',
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;
      }
}

export async function getAllMenuItemsByCategoryQueryable(category,sortBy,menuName) {
  const finalUrl = new URL(`api/MenuItems/${category}/${sortBy}?menuName=${menuName}`, BASE_URL)
  const token = await getToken();
  try {
      const response = await fetch(finalUrl,{
          method:'GET',
          headers:{
              "Authorization":`Bearer ${token}`
          }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      throw error;
    }
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
