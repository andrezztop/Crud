export async function getProduct() {
  try {
    const resp = await fetch("http://localhost:8080/products", {
      credentials: 'include'
    });

    if (!resp.ok) {
      throw new Error(`¡Error HTTP! Estado: ${resp.status}`);
    }

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
}

export async function muestra(products) {
  try {
    const resp = await fetch("http://localhost:8080/products", {
      method: "POST",
      body: JSON.stringify(products),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });

    if (!resp.ok) {
      throw new Error(`¡Error HTTP! Estado: ${resp.status}`);
    }

    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error al mostrar los productos:", error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    if (!id) throw new Error("ID del producto no válido");
    
    const cleanId = id.toString().trim();
    const resp = await fetch(`http://localhost:8080/products/${cleanId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: 'include'
    });

    if (!resp.ok) {
      const errorData = await resp.text();
      throw new Error(`Error HTTP: ${resp.status} - ${errorData}`);
    }

    // Esperar la respuesta completa del servidor
    const data = await resp.json().catch(() => ({ success: resp.ok }));
    return data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
}