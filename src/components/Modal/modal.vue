<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
  
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <!-- Close button -->
            <div class="absolute top-0 right-0 pt-4 pr-4">
              <button 
                @click="$emit('close')" 
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Cerrar modal"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Agregar/Editar Producto
                </h3>
                <div class="mt-2">
                  <form @submit.prevent="submitForm" class="space-y-4">
                    <div>
                      <label for="title" class="block text-sm font-medium text-gray-700">Título</label>
                      <input type="text" id="title" v-model="form.title" @blur="validateField('title')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
                    </div>
  
                    <div>
                      <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                      <textarea id="description" v-model="form.description" @blur="validateField('description')"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                    </div>
  
                    <div>
                      <label for="category" class="block text-sm font-medium text-gray-700">Categoría</label>
                      <div class="flex">
                        <select v-model="form.category" @change="onCategoryChange" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                          <option value="">Seleccionar categoría</option>
                          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                          <option value="custom">Otra</option>
                        </select>
                      </div>
                      <input v-if="showCustomCategory" type="text" v-model="customCategory" @blur="addCustomCategory" placeholder="Ingrese nueva categoría"
                             class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
                    </div>
  
                    <div>
                      <label for="price" class="block text-sm font-medium text-gray-700">Precio</label>
                      <input type="number" id="price" v-model="form.price" step="0.01" @blur="validateField('price')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
                    </div>
  
                    <div>
                      <label for="discountPercentage" class="block text-sm font-medium text-gray-700">Porcentaje de descuento</label>
                      <input type="number" id="discountPercentage" v-model="form.discountPercentage" step="0.01" @blur="validateField('discountPercentage')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.discountPercentage" class="mt-1 text-sm text-red-600">{{ errors.discountPercentage }}</p>
                    </div>
  
                    <div>
                      <label for="rating" class="block text-sm font-medium text-gray-700">Calificación</label>
                      <input type="number" id="rating" v-model="form.rating" step="0.01" min="0" max="5" @blur="validateField('rating')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.rating" class="mt-1 text-sm text-red-600">{{ errors.rating }}</p>
                    </div>
  
                    <div>
                      <label for="stock" class="block text-sm font-medium text-gray-700">Stock</label>
                      <input type="number" id="stock" v-model="form.stock" @blur="validateField('stock')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock }}</p>
                    </div>
  
                    <div>
                      <label for="availabilityStatus" class="block text-sm font-medium text-gray-700">Estado de disponibilidad</label>
                      <input type="text" id="availabilityStatus" :value="availabilityStatus" disabled
                             class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>
  
                    <div>
                      <label for="brand" class="block text-sm font-medium text-gray-700">Marca</label>
                      <input type="text" id="brand" v-model="form.brand" @blur="validateField('brand')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.brand" class="mt-1 text-sm text-red-600">{{ errors.brand }}</p>
                    </div>
  
                    <div>
                      <label for="sku" class="block text-sm font-medium text-gray-700">SKU</label>
                      <input type="text" id="sku" v-model="form.sku" @blur="validateField('sku')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.sku" class="mt-1 text-sm text-red-600">{{ errors.sku }}</p>
                    </div>
  
                    <div>
                      <label for="barcode" class="block text-sm font-medium text-gray-700">Código de barras</label>
                      <input type="text" id="barcode" v-model="form.meta.barcode" @blur="validateField('barcode')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    </div>
  
                    <div>
                      <label for="weight" class="block text-sm font-medium text-gray-700">Peso</label>
                      <input type="number" id="weight" v-model="form.weight" step="0.01" @blur="validateField('weight')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.weight" class="mt-1 text-sm text-red-600">{{ errors.weight }}</p>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Dimensiones</label>
                      <div class="grid grid-cols-3 gap-2">
                        <div>
                          <label for="width" class="block text-xs text-gray-500">Ancho</label>
                          <input type="number" id="width" v-model="form.dimensions.width" step="0.01"
                                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        </div>
                        <div>
                          <label for="height" class="block text-xs text-gray-500">Alto</label>
                          <input type="number" id="height" v-model="form.dimensions.height" step="0.01"
                                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        </div>
                        <div>
                          <label for="depth" class="block text-xs text-gray-500">Profundidad</label>
                          <input type="number" id="depth" v-model="form.dimensions.depth" step="0.01"
                                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        </div>
                      </div>
                    </div>
  
                    <div>
                    <label for="warrantyInformation" class="block text-sm font-medium text-gray-700">Información de garantía</label>
                    <div class="flex space-x-2">
                      <input 
                        type="number" 
                        id="warrantyDuration" 
                        v-model="form.warrantyDuration" 
                        @blur="updateWarrantyInformation"
                        class="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      
                      <select 
                        v-model="form.warrantyUnit" 
                        @change="updateWarrantyInformation"
                        class="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="días">Días</option>
                        <option value="meses">Meses</option>
                        <option value="años">Años</option>
                      </select>
                    </div>
                      <p v-if="errors.warrantyInformation" class="mt-1 text-sm text-red-600">{{ errors.warrantyInformation }}</p>
                    </div>
  
                    <div>
                      <label for="shippingInformation" class="block text-sm font-medium text-gray-700">Información de envío</label>
                      <input type="text" id="shippingInformation" v-model="form.shippingInformation" @blur="validateField('shippingInformation')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.shippingInformation" class="mt-1 text-sm text-red-600">{{ errors.shippingInformation }}</p>
                    </div>
  
                    <div>
                      <label for="returnPolicy" class="block text-sm font-medium text-gray-700">Política de devolución</label>
                      <input type="text" id="returnPolicy" v-model="form.returnPolicy" @blur="validateField('returnPolicy')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.returnPolicy" class="mt-1 text-sm text-red-600">{{ errors.returnPolicy }}</p>
                    </div>
  
                    <div>
                      <label for="minimumOrderQuantity" class="block text-sm font-medium text-gray-700">Cantidad mínima de pedido</label>
                      <input type="number" id="minimumOrderQuantity" v-model="form.minimumOrderQuantity" @blur="validateField('minimumOrderQuantity')"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      <p v-if="errors.minimumOrderQuantity" class="mt-1 text-sm text-red-600">{{ errors.minimumOrderQuantity }}</p>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Reseñas</label>
                      <div v-for="(review, index) in form.reviews" :key="index" class="mt-2 p-2 border rounded">
                        <div class="grid grid-cols-2 gap-2">
                          <div>
                            <label :for="'rating-'+index" class="block text-xs text-gray-500">Calificación</label>
                            <input type="number" :id="'rating-'+index" v-model="review.rating" min="1" max="5"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                          </div>
                          <div>
                            <label :for="'reviewer-'+index" class="block text-xs text-gray-500">Nombre del revisor</label>
                            <input type="text" :id="'reviewer-'+index" v-model="review.reviewerName"
                                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                          </div>
                        </div>
                        <div class="mt-2">
                          <label :for="'comment-'+index" class="block text-xs text-gray-500">Comentario</label>
                          <textarea :id="'comment-'+index" v-model="review.comment"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                        </div>
                      </div>
                      <button type="button" @click="addReview" class="mt-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                        Agregar reseña
                      </button>
                    </div>
  
                    <div>
                    <label for="image" class="block text-sm font-medium text-gray-700">URL de la imagen</label>
                    <input type="url" id="images" v-model="form.images" @blur="validateField('images')"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <p v-if="errors.images" class="mt-1 text-sm text-red-600">{{ errors.images }}</p>
                    </div>
  
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button type="submit"
                              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Guardar
                      </button>
                      <button type="button" @click="$emit('close')"
                              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch} from 'vue'
  import {muestra} from '../../services/productService';

  
  const categories = ref(['tecnologia', 'medicina', 'maquillaje'])
  const showCustomCategory = ref(false)
  const customCategory = ref('')
  
  const form = reactive({
      title: '',
      description: '',
      category: '',
      price: null,
      discountPercentage: null,
      rating: null,
      stock: null,
      availabilityStatus:null,
      brand: '',
      sku: '',
      weight: null,
      dimensions: {
        width: null,
        height: null,
        depth: null
      },
      warrantyInformation: null, // Concatenación de duración y unidad
      shippingInformation: '',
      returnPolicy: '',
      minimumOrderQuantity: null,
      reviews: [],
      images: null,
      meta:{
        barcode: '',
      }
    });
  
  const errors = reactive({})


    // Function to update warrantyInformation based on inputs
    const updateWarrantyInformation = () => {
      if (form.warrantyDuration && form.warrantyUnit) {
        form.warrantyInformation = `${form.warrantyDuration} ${form.warrantyUnit}`;
      } else {
        form.warrantyInformation = null;
      }
    };

    // Watcher to automatically update warrantyInformation
    watch(
      [() => form.warrantyDuration, () => form.warrantyUnit],
      updateWarrantyInformation
    );
  
  const validateField = (field) => {
    errors[field] = ''
    switch (field) {
      case 'title':
        if (!form.title) errors.title = 'El título es requerido'
        else if (form.title.length < 3) errors.title = 'El título debe tener al menos 3 caracteres'
        break
      case 'description':
        if (!form.description) errors.description = 'La descripción es requerida'
        else if (form.description.length < 10) errors.description = 'La descripción debe tener al menos 10 caracteres'
        break
      case 'category':
        if (!form.category) errors.category = 'La categoría es requerida'
        break
      case 'price':
        if (form.price === null) errors.price = 'El precio es requerido'
        else if (form.price <= 0) errors.price = 'El precio debe ser mayor que 0'
        break
      case 'stock':
        if (form.stock === null) errors.stock = 'El stock es requerido'
        else if (form.stock < 0) errors.stock = 'El stock no puede ser negativo'
        break
      case 'brand':
        if (!form.brand) errors.brand = 'La marca es requerida'
        break
      case 'images':
        if (!form.images) errors.images = 'La imagen es requerida'
        break
      case 'warrantyDuration':
        if (form.warrantyDuration === null) errors.warrantyDuration = 'La duración de la garantía es requerida'
        else if (form.warrantyDuration <= 0) errors.warrantyDuration = 'La duración de la garantía debe ser mayor que 0'
        break
    }
  }
  
  const validateForm = () => {
    let isValid = true
    for (const field in form) {
      if (typeof form[field] === 'string' || typeof form[field] === 'number') {
        validateField(field)
        if (errors[field]) isValid = false
      }
    }
    return isValid
  }
  
 const submitForm = async () => {
    if (validateForm()) {
      try {
        const formData = { ...form };
        // If editing, use updateProduct, otherwise use createProduct
        const response = props.product 
          ? await updateProduct(props.product.id, formData)
          : await muestra(formData);
        
        emit('submit', response);
        emit('close');
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    }
  };

  const addReview = () => {
    form.reviews.push({
      rating: 5,
      comment: '',
      reviewerName: '',
      date: new Date().toISOString()
    })
  }
  
  const onCategoryChange = () => {
    if (form.category === 'custom') {
      showCustomCategory.value = true
      form.category = ''
    } else {
      showCustomCategory.value = false
    }
  }
  
  const addCustomCategory = () => {
    if (customCategory.value && !categories.value.includes(customCategory.value)) {
      categories.value.push(customCategory.value)
      form.category = customCategory.value
      customCategory.value = ''
      showCustomCategory.value = false
    }
  }
  
  const availabilityStatus = computed(() => {
    return form.stock >= 10 ? 'Disponibilidad abundante' : 'Poca disponibilidad'
  })
  
  // Definir los eventos que este componente puede emitir
  const emit = defineEmits(['close', 'submit'])
  </script>