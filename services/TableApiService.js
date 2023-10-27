const BASE_URL = "http://10.0.2.2:5240";


export async function getAllTables() {
    const finalUrl = new URL('api/tables', BASE_URL)

    try {
        const response = await fetch(finalUrl);
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
