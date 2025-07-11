<script setup>
import { onMounted } from 'vue'
import { useCollectionStore } from './stores/collection'

// 使用Pinia store
const collectionStore = useCollectionStore()

// 組件掛載時載入收藏資料
onMounted(() => {
  collectionStore.loadCollections()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="navbar bg-base-100 shadow-sm">

      <div class="flex-1">
        <a class="btn btn-ghost text-xl">Ubike蒐藏網頁</a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/ubike" class="hover:bg-base-200">查ubike</router-link></li>
          <li>
            <router-link to="/collection" class="hover:bg-base-200 flex items-center gap-2">
              看蒐藏
              <div v-if="collectionStore.getCollectionCount > 0" class="badge badge-primary badge-sm">
                {{ collectionStore.getCollectionCount }}
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="container mx-auto flex-1">
      <router-view />
    </div>
    <footer class="footer footer-center p-4 bg-base-200 text-base-content">
      <div>
        <p>Copyright © 2025 - All right reserved by Auo</p>
      </div> 
    </footer>
  </div>
</template>

<style scoped>
.router-link-active {
  background-color: oklch(var(--b2));
  font-weight: 600;
}

.router-link-exact-active {
  background-color: oklch(var(--p));
  color: oklch(var(--pc));
}
</style>
