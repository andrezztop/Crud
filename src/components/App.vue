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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titulo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Codigo de Barra</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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

    <!-- Modal Component -->
    <ProductFormModal 
      v-if="isModalOpen" 
      @close="closeModal"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed, onMounted } from 'vue'
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-responsive';
import 'datatables.net-select';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import ProductFormModal from './Modal/modal.vue';
import { getProduct, deleteProduct } from '../services/productService';

DataTable.use(DataTablesCore);

const dataTable = ref(null);

const eliminar = async (id) => {
  try {
    const result = await deleteProduct(id);
    if (result) {
      console.log('Producto eliminado exitosamente');
      await reloadTable(); // Este es el punto clave
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
  }
};

const handleDelete = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    eliminar(id);
  }
};

const reloadTable = async () => {
  try {
    const newData = await getProduct();
    products.value = newData;
    
    if (dataTable.value?.dt) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Pequeño delay para asegurar la actualización
      dataTable.value.dt.clear();
      dataTable.value.dt.rows.add(newData);
      dataTable.value.dt.draw();
    }
  } catch (error) {
    console.error("Error recargando la tabla:", error);
  }
};


onBeforeMount(async () => {
  try {
    const data = await getProduct()
    products.value = data
  } catch (error) {
    console.error("Error en onBeforeMount:", error)
  }
});

const options = {
  responsive: true,
  select: true,
  language: language,
  searching: false
};

const products = ref([])
const searchQuery = ref('')
const columns = [
  { 
    data: 'title',
    title: 'Titulo',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  },
  { 
    data: 'category',
    title: 'Categoria',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  },
  { 
    data: 'price',
    title: 'Precio',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  },
  { 
    data: 'meta.barcode',
    title: 'Codigo de Barra',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  },
  { 
    data: 'price',
    title: 'Precio USD',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  },
  {
    data: null,
    title: 'Acciones',
    className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    render: function (data, type, row) {
      // Asegúrate de que row._id existe y lo usamos correctamente
      return `
        <div class="flex justify-end space-x-2">
          <button class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Ver
          </button>
          <button class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Editar
          </button>
          <button 
            class="delete-btn inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            data-id="${row._id || row.id}">
            Eliminar
          </button>
        </div>
      `;
    }
}
];

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleFormSubmit = async (formData) => {
  try {
    console.log('Form submitted:', formData)
    await reloadTable()  // Recargar la tabla después de enviar el formulario
    closeModal()
  } catch (error) {
    console.error("Error handling form submit:", error)
  }
}

onMounted(() => {
  document.addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      if (id) {
        handleDelete(id);
      } else {
        console.error('No se encontró ID del producto');
      }
    }
  });

  // Opcional: Limpieza del event listener
  return () => {
    document.removeEventListener('click', handleClick);
  };
});
</script>