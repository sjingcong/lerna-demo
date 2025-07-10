<template>
  <div class="product-card">
    <div class="product-image">
      <!-- <img :src="data.image" :alt="data.name" /> -->
    </div>
    <div class="product-info">
      <h3 class="product-name">{{ data.name }}</h3>
      <p class="product-description">{{ data.description }}</p>
      <div class="product-price">
        <span class="price">¥{{ data.price }}</span>
        <span v-if="data.originalPrice" class="original-price">¥{{ data.originalPrice }}</span>
      </div>
      <div class="product-actions">
        <button class="btn-primary" @click="handleAddToCart">加入购物车</button>
        <button class="btn-secondary" @click="handleBuyNow">立即购买</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProductData {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface Props {
  data: ProductData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addToCart: [productId: string | number];
  buyNow: [productId: string | number];
}>();

const handleAddToCart = () => {
  emit('addToCart', props.data.id);
};

const handleBuyNow = () => {
  emit('buyNow', props.data.id);
};
</script>

<style scoped>
.product-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.product-price {
  margin-bottom: 16px;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: #ff4d4f;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  background-color: #e6f7ff;
  border-color: #1890ff;
}
</style>