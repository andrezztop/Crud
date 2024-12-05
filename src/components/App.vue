<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto space-y-4">
      <!-- Search Bar -->
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="Buscar..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          v-model="searchQuery"
        />
      </div>

      <!-- Data Table Area -->
      <DataTable
        ref="dataTable"
        :columns="columns"
        :data="products"
        :options="options"
        class="display cell-border order-column"
      >
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" :key="column.data" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ column.title }}
            </th>
          </tr>
        </thead>
      </DataTable>

      <!-- Add Button -->
      <div class="flex justify-end">
        <button
          @click="openModal"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agregar
        </button>
      </div>
    </div>

    <!-- Product Form Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl font-semibold mb-4">
          {{ selectedProduct ? 'Editar Producto' : 'Agregar Producto' }}
        </h2>
        
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                v-model="formData.title"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                v-model="formData.description"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                v-model="formData.category"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccionar categoría</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                <option value="custom">Otra</option>
              </select>
              <input
                v-if="showCustomCategory"
                type="text"
                v-model="customCategory"
                @blur="addCustomCategory"
                placeholder="Ingrese nueva categoría"
                class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                v-model="formData.price"
                required
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Descuento (%)</label>
              <input
                type="number"
                v-model="formData.discountPercentage"
                step="0.01"
                min="0"
                max="95"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Precio con descuento</label>
              <input
                type="number"
                :value="discountedPrice"
                disabled
                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                v-model="formData.stock"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Marca</label>
              <input
                type="text"
                v-model="formData.brand"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                v-model="formData.sku"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Código de Barras</label>
              <input
                type="text"
                v-model="formData.meta.barcode"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Peso (kg)</label>
              <input
                type="number"
                v-model="formData.weight"
                step="0.01"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Dimensiones (cm)</label>
              <div class="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  v-model="formData.dimensions.width"
                  placeholder="Ancho"
                  step="0.1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="formData.dimensions.height"
                  placeholder="Alto"
                  step="0.1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="number"
                  v-model="formData.dimensions.depth"
                  placeholder="Profundidad"
                  step="0.1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Garantía</label>
              <div class="flex space-x-2">
                <input
                  type="number"
                  v-model="formData.warrantyDuration"
                  placeholder="Duración"
                  class="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <select
                  v-model="formData.warrantyUnit"
                  class="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="días">Días</option>
                  <option value="meses">Meses</option>
                  <option value="años">Años</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Información de Envío</label>
              <input
                type="text"
                v-model="formData.shippingInformation"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Política de Devolución</label>
              <input
                type="text"
                v-model="formData.returnPolicy"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Cantidad Mínima de Pedido</label>
              <input
                type="number"
                v-model="formData.minimumOrderQuantity"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">URL de la Imagen</label>
              <input
                type="url"
                v-model="formData.images"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Reseñas</label>
            <div v-for="(review, index) in formData.reviews" :key="index" class="mt-2 p-2 border rounded">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label :for="'rating-'+index" class="block text-xs text-gray-500">Calificación</label>
                  <input type="number" :id="'rating-'+index" v-model="review.rating" min="1" max="5" step="0.1"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
                <div>
                  <label :for="'reviewer-'+index" class="block text-xs text-gray-500">Nombre del revisor</label>
                  <input type="text" :id="'reviewer-'+index" v-model="review.reviewerName"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                </div>
              </div>
              <div class="mt-2">
                <label :for="'comment-'+index" class="block text-xs text-gray-500">Comentario</label>
                <textarea :id="'comment-'+index" v-model="review.comment"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
            </div>
            <button type="button" @click="addReview" class="mt-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
              Agregar reseña
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Rating promedio</label>
            <input
              type="number"
              :value="averageRating"
              disabled
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
            />
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="handleCloseModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {{ selectedProduct ? 'Guardar Cambios' : 'Crear Producto' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Product Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl font-semibold mb-4">Detalles del Producto</h2>
        <div v-if="selectedProduct" class="space-y-4">
          <p><strong>Título:</strong> {{ selectedProduct.title }}</p>
          <p><strong>Descripción:</strong> {{ selectedProduct.description }}</p>
          <p><strong>Categoría:</strong> {{ selectedProduct.category }}</p>
          <p><strong>Precio original:</strong> ${{ selectedProduct.price.toFixed(2) }}</p>
          <p><strong>Descuento:</strong> {{ selectedProduct.discountPercentage }}%</p>
          <p><strong>Precio con descuento:</strong> ${{ (selectedProduct.price * (1 - selectedProduct.discountPercentage / 100)).toFixed(2) }}</p>
          <p><strong>Stock:</strong> {{ selectedProduct.stock }}</p>
          <p><strong>Marca:</strong> {{ selectedProduct.brand }}</p>
          <p><strong>SKU:</strong> {{ selectedProduct.sku }}</p>
          <p><strong>Código de Barras:</strong></p>
          <svg ref="barcodeContainer"></svg>
          <p><strong>Peso:</strong> {{ selectedProduct.weight }} kg</p>
          <p><strong>Dimensiones:</strong> {{ selectedProduct.dimensions.width }}x{{ selectedProduct.dimensions.height }}x{{ selectedProduct.dimensions.depth }} cm</p>
          <p><strong>Garantía:</strong> {{ selectedProduct.warrantyDuration }} {{ selectedProduct.warrantyUnit }}</p>
          <p><strong>Información de Envío:</strong> {{ selectedProduct.shippingInformation }}</p>
          <p><strong>Política de Devolución:</strong> {{ selectedProduct.returnPolicy }}</p>
          <p><strong>Cantidad Mínima de Pedido:</strong> {{ selectedProduct.minimumOrderQuantity }}</p>
          <p><strong>Rating promedio:</strong> {{ selectedProduct.rating }}</p>
          <div>
            <strong>Reseñas:</strong>
            <div v-for="(review, index) in selectedProduct.reviews" :key="index" class="mt-2 p-2 border rounded">
              <p><strong>Calificación:</strong> {{ review.rating }}/5</p>
              <p><strong>Revisor:</strong> {{ review.reviewerName }}</p>
              <p><strong>Comentario:</strong> {{ review.comment }}</p>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="closeViewModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed, watch, onMounted, nextTick } from 'vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net';
import 'datatables.net-responsive';
import 'datatables.net-select';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import { getProduct, updateProduct, deleteProduct, muestra } from '../services/productService';
import JsBarcode from 'jsbarcode';

DataTable.use(DataTablesCore);

const dataTable = ref(null);
const products = ref([]);
const searchQuery = ref('');
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const selectedProduct = ref(null);
const categories = ref(['tecnologia', 'medicina', 'maquillaje']);
const showCustomCategory = ref(false);
const customCategory = ref('');
const barcodeContainer = ref(null);

const formData = ref({
  title: '',
  description: '',
  category: '',
  price: null,
  discountPercentage: null,
  stock: null,
  brand: '',
  sku: '',
  weight: null,
  dimensions: {
    width: null,
    height: null,
    depth: null
  },
  warrantyDuration: null,
  warrantyUnit: 'días',
  shippingInformation: '',
  returnPolicy: '',
  minimumOrderQuantity: null,
  reviews: [],
  images: null,
  meta: {
    barcode: '',
  }
});

const options = {
  responsive: true,
  select: true,
  language: language,
  searching: false,
  rowCallback: function(row, data) {
    const viewBtn = row.querySelector('.view-btn');
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    
    if (viewBtn) {
      viewBtn.onclick = () => handleView(data.id);
    }
    if (editBtn) {
      editBtn.onclick = () => handleEdit(data.id);
    }
    if (deleteBtn) {
      deleteBtn.onclick = () => handleDelete(data.id);
    }

    // Generar código de barras en la tabla
    const barcodeElement = row.querySelector(`#barcode-${data.id}`);
    if (barcodeElement && data.meta && data.meta.barcode) {
      JsBarcode(barcodeElement, data.meta.barcode, {
        format: "CODE128",
        width: 1,
        height: 30,
        displayValue: false
      });
    }
  }
};

const columns = [
  { data: 'title', title: 'Titulo' },
  { data: 'category', title: 'Categoria' },
  { 
    data: 'price', 
    title: 'Precio',
    render: (data, type, row) => {
      const discountedPrice = data * (1 - row.discountPercentage / 100);
      return `$${discountedPrice.toFixed(2)}`;
    }
  },
  { 
    data: 'stock', 
    title: 'Stock',
    render: (data) => `${data} ${parseInt(data) > 10 ? '<span class="text-green-600">(Stock disponible)</span>' : '<span class="text-red-600">(Poco stock)</span>'}`
  },
  { data: 'brand', title: 'Marca' },
  { data: 'sku', title: 'SKU' },
  { 
    data: 'meta.barcode', 
    title: 'Código de Barra',
    render: function(data, type, row) {
      if (type === 'display') {
        return `<svg id="barcode-${row.id}"></svg>`;
      }
      return data;
    }
  },
  {
    data: null,
    title: 'Acciones',
    orderable: false,
    render: function(data, type) {
      if (type === 'display') {
        return `
          <div class="flex space-x-2">
            <button class="view-btn bg-blue-600 text-white px-3 py-1 rounded">Ver</button>
            <button class="edit-btn bg-green-600 text-white px-3 py-1 rounded">Editar</button>
            <button class="delete-btn bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
          </div>
        `;
      }
      return data;
    }
  }
];

const averageRating = computed(() => {
  if (formData.value.reviews.length === 0) return 0;
  const sum = formData.value.reviews.reduce((acc, review) => acc + Number(review.rating), 0);
  return (sum / formData.value.reviews.length).toFixed(1);
});

const discountedPrice = computed(() => {
  const price = Number(formData.value.price);
  const discount = Number(formData.value.discountPercentage);
  if (isNaN(price) || isNaN(discount)) return price;
  return (price * (1 - discount / 100)).toFixed(2);
});

const openModal = () => {
  selectedProduct.value = null;
  resetFormData();
  isModalOpen.value = true;
};

const handleCloseModal = () => {
  selectedProduct.value = null;
  resetFormData();
  isModalOpen.value = false;
};

const resetFormData = () => {
  formData.value = {
    title: '',
    description: '',
    category: '',
    price: null,
    discountPercentage: null,
    stock: null,
    brand: '',
    sku: '',
    weight: null,
    dimensions: {
      width: null,
      height: null,
      depth: null
    },
    warrantyDuration: null,
    warrantyUnit: 'días',
    shippingInformation: '',
    returnPolicy: '',
    minimumOrderQuantity: null,
    reviews: [],
    images: null,
    meta: {
      barcode: '',
    }
  };
};

const handleFormSubmit = async () => {
  try {
    const productData = { ...formData.value };
    productData.warrantyInformation = `${productData.warrantyDuration} ${productData.warrantyUnit}`;
    productData.rating = averageRating.value;
    productData.price = Number(formData.value.price);
    
    if (selectedProduct.value) {
      await updateProduct(selectedProduct.value.id, productData);
    } else {
      await muestra(productData);
    }
    handleCloseModal();
    await reloadTable();
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
};

const handleEdit = async (id) => {
  try {
    const productToEdit = products.value.find(p => p.id === parseInt(id));
    console.log(productToEdit)
    if (productToEdit) {
      selectedProduct.value = { ...productToEdit };
      formData.value = { ...productToEdit }; // Esto incluye las reseñas
      isModalOpen.value = true;
    }
  } catch (error) {
    console.error('Error al preparar la edición:', error);
  }
};

const reloadTable = async () => {
  try {
    // Actualiza tus datos internos
    const newData = await getUpdatedData(); // Función que obtenga los nuevos datos

    // Destruye la tabla existente (si existe)
    if (dataTable.value?.dt) {
      dataTable.value.dt.destroy();
    }

    // Actualiza los datos internos
    products.value = newData;

    // Re-inicializa la tabla con los nuevos datos
    if (dataTable.value) {
      dataTable.value.dt = await new DataTablesCore().use(plugins => [
        plugins.dataTable(),
        plugins.select(),
        plugins.responsive(),
        plugins.i18n(language)
      ]);

      dataTable.value.dt.clear().rows.add(newData).draw();
    }

    // Regenera códigos de barras después de recargar la tabla
    nextTick(() => {
      newData.forEach(product => {
        const barcodeElement = document.querySelector(`#barcode-${product.id}`);
        if (barcodeElement && product.meta && product.meta.barcode) {
          JsBarcode(barcodeElement, product.meta.barcode, {
            format: "CODE128",
            width: 1,
            height: 30,
            displayValue: false
          });
        }
      });
    });
  } catch (error) {
    console.error('Error recargando la tabla:', error);
  }
  window.location.reload();
};

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    try {
      await deleteProduct(id);
      await reloadTable();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }
  window.location.reload();
};

const handleView = async (id) => {
  try {
    const productToView = products.value.find(p => p.id === parseInt(id));
    if (productToView) {
      selectedProduct.value = { ...productToView };
      isViewModalOpen.value = true;
      await nextTick();
      renderBarcode();
    }
  } catch (error) {
    console.error('Error al preparar la vista:', error);
  }
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  selectedProduct.value = null;
};

const renderBarcode = () => {
  if (barcodeContainer.value && selectedProduct.value?.meta?.barcode) {
    JsBarcode(barcodeContainer.value, selectedProduct.value.meta.barcode, {
      format: "CODE128",
      width: 2,
      height: 100,
      displayValue: true
    });
  }
};

const addReview = () => {
  formData.value.reviews.push({
    rating: 5,
    comment: '',
    reviewerName: '',
    date: new Date().toISOString()
  });
};


const addCustomCategory = () => {
  if (customCategory.value && !categories.value.includes(customCategory.value)) {
    categories.value.push(customCategory.value);
    formData.value.category = customCategory.value;
    customCategory.value = '';
    showCustomCategory.value = false;
  }
};

onBeforeMount(async () => {
  try {
    const data = await getProduct();
    products.value = data;
  } catch (error) {
    console.error('Error en onBeforeMount:', error);
  }
});

onMounted(() => {
  if (dataTable.value?.dt) {
    dataTable.value.dt.clear();
    dataTable.value.dt.rows.add(products.value);
    dataTable.value.dt.draw();
  }
});

watch(searchQuery, (newQuery) => {
  if (dataTable.value?.dt) {
    dataTable.value.dt.search(newQuery).draw();
  }
});
</script>