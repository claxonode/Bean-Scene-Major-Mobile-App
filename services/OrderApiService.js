import { getToken } from "./TokenStorage";
const BASE_URL = "http://10.0.2.2:5240";

export async function postNewOrder(order) {
    const finalUrl = new URL('api/Orders', BASE_URL)
    const token = await getToken();
    // console.log(orderCart)
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