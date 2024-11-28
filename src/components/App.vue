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
      <DataTable :columns="columns" :options="options" class="display">
        <thead>
          <tr>
            <th>First</th>
            <th>Second</th>
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
import { onBeforeMount, ref, computed } from 'vue'
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-responsive';
import 'datatables.net-select';
import language from 'datatables.net-plugins/i18n/es-ES.mjs';
import ProductFormModal from './Modal/modal.vue';
import {getProduct} from '../services/productService';
 
DataTable.use(DataTablesCore);

onBeforeMount(async () => {
  try {
    const data = await getProduct();
    console.log(data);
  } catch (error) {
    console.error("Error en onBeforeMount:", error);
  }
});

const options = {
  responsive: true,
  select: true,
  language: language,
  searching: false
};

const searchQuery = ref('')
const columns = [
  { data: 'title', title: 'Titulo' },
  { data: 'category', title: 'Categoria' },
  { data: 'price', title: 'Precio' },
  { data: 'barcode', title: 'Codigo de Barra' },
  { 
    data: null, 
    title: 'Acciones',
    render: function (data, type, row) {
      return `
        <button class="view-button">Ver</button>
        <button class="edit-button">Editar</button>
        <button class="delete-button">Eliminar</button>
      `;
    }
  },
];
const hasData = computed(() => data.value.length > 0)

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleFormSubmit = (formData) => {
  console.log('Form submitted:', formData)
  // Aquí puedes implementar la lógica para agregar el nuevo producto a tu lista o enviarlo a una API
  closeModal()
}
</script>