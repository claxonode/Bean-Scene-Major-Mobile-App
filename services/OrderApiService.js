import { getToken } from "./TokenStorage";
const BASE_URL = "http://10.0.2.2:5240";

export async function postNewOrder(order) {
    const finalUrl = new URL('api/Orders', BASE_URL)
    const token = await getToken();
    try {
        const response = await fetch(finalUrl,{
            method:'POST',
            headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body: JSON.stringify(order)
        });
        if (response.ok) {
            return response;
        }
        throw new Error(`${response.status}`);
      } catch (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        throw error;
      }
}
export async function updateOrder(order) {
    const finalUrl = new URL('api/Orders',BASE_URL)
    const token = await getToken();
    try {
      const response = await fetch(finalUrl,{
        method:"PUT",
        headers: {
          "Authorization":`Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify(order)
      });
      if (response.ok) {
        return response;
      }
      throw new Error(`${response.status}`)
    } catch (error) {
        console.log("There has been a problem with your fetch operation: "+error.message)
        throw error;
      }
}

export async function approveOrderItem(order,menuItem){
  const finalUrl = new URL(`api/Orders/${menuItem}`,BASE_URL)
  const token = await getToken();
  const data = {orderId:order.orderId,
    productItem:menuItem.name,
  }
  try {
    const response = await fetch(finalUrl,{
      method:"PUT",
      headers: {
        "Authorization":`Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      return response;
    }
    throw new Error(`${response.status}`)
  } catch (error) {
      console.log("There has been a problem with your fetch operation: "+error.message)
      throw error;
    }
}


export async function getOrders() {
    const finalUrl = new URL('api/orders/', BASE_URL)
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