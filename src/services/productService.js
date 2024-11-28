export async function getProduct() {
  try {
    const resp = await fetch("http://localhost:8080/products");

    if (!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Vuelve a lanzar el error si necesitas manejarlo en otro lugar.
  }
}

export async function muestra(products){
  try {
    const resp = await fetch("http://localhost:8080/products", {
      method: "POST",
      body: JSON.stringify(products),  // Convertir products a JSON
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Vuelve a lanzar el error si necesitas manejarlo en otro lugar.
  }
}
