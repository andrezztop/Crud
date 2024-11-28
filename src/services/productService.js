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

export async function deleteProduct(id) {
  try {
    const resp = await fetch(`http://localhost:8080/products/eliminar/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      const errorText = await resp.text(); // Captura errores como texto
      throw new Error(`HTTP error! Status: ${resp.status}. ${errorText}`);
    }

    const data = await resp.json(); // Ahora se puede interpretar como JSON
    return data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
}
