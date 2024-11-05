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
      <div class="bg-white rounded-lg shadow-sm min-h-[400px] relative">
        <div v-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-400">
          Datatable placeholder
        </div>
        
        <!-- Table content would go here when there's data -->
        <table v-else class="w-full">
          <!-- Table content -->
        </table>
      </div>

      <!-- Add Button -->
      <div class="flex justify-end">
        <button
          @click="handleAdd"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const data = ref([])

const hasData = computed(() => data.value.length > 0)

const handleAdd = () => {
  // Implement add functionality
  console.log('Add button clicked')
}
</script>