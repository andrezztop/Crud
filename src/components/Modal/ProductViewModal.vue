<!-- ProductViewModal.vue -->
<template>
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <h2>{{ product.title }}</h2>
      <p>Categoría: {{ product.category }}</p>
      <p>Precio: {{ product.price }}</p>
      <p>Código de Barra: {{ product.meta.barcode }}</p>
      <button @click="closeModal">Cerrar</button>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    product: Object,
  });
  
  const emit = defineEmits(['close']);
  
  const closeModal = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 80%;
    max-height: 90vh;
    overflow-y: auto;
  }
  </style>