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
    throw error;
  }
}

export async function getProductById(id) {
  try {
    const resp = await fetch(`http://localhost:8080/products/${id}`);
    if (!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
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
      }
    });
    if (!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
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
      const errorText = await resp.text();
      throw new Error(`HTTP error! Status: ${resp.status}. ${errorText}`);
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
  
}

export async function updateProduct(id, productData) {
  try {
    const resp = await fetch(`http://localhost:8080/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}