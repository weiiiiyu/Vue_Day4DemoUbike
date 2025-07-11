<script setup>
import { onMounted } from 'vue'
import { useCollectionStore } from '../stores/collection'

// 使用Pinia store
const collectionStore = useCollectionStore()

// 組件掛載時載入收藏資料
onMounted(() => {
  collectionStore.loadCollections()
})

// 移除收藏
const removeFromCollection = (sno) => {
  collectionStore.removeCollection(sno)
}

// 清空所有收藏
const clearAllCollections = () => {
  if (confirm('確定要清空所有收藏嗎？')) {
    collectionStore.clearCollections()
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">我的收藏</h1>
      <div class="flex gap-2">
        <div class="badge badge-primary">{{ collectionStore.getCollectionCount }} 個站點</div>
        <button 
          v-if="collectionStore.collections.length > 0"
          @click="clearAllCollections"
          class="btn btn-sm btn-error btn-outline"
        >
          清空收藏
        </button>
      </div>
    </div>
    
    <div v-if="collectionStore.collections.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      <p class="text-gray-500 text-lg">暂无收藏的站点</p>
      <p class="text-gray-400 text-sm mt-2">去搜索頁面添加您喜歡的Ubike站點吧！</p>
    </div>
    
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="station in collectionStore.collections"
        :key="station.sno"
        class="card bg-base-100 shadow-md border hover:shadow-lg transition-shadow"
      >
        <div class="card-body">
          <h2 class="card-title text-lg">{{ station.sna }}</h2>
          
          <!-- 重點顯示 ar (地址) 和 sarea (區域) -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="badge badge-primary">區域</span>
              <span class="font-semibold">{{ station.sarea }}</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="badge badge-secondary">地址</span>
              <span class="text-sm">{{ station.ar }}</span>
            </div>
          </div>
          
          <!-- 站點資訊 -->
          <div class="divider my-2"></div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="stat">
              <div class="stat-title text-xs">可借車輛</div>
              <div class="stat-value text-lg text-success">{{ station.available_rent_bikes }}</div>
            </div>
            <div class="stat">
              <div class="stat-title text-xs">可還空位</div>
              <div class="stat-value text-lg text-info">{{ station.available_return_bikes }}</div>
            </div>
          </div>
          
          <!-- 收藏時間 -->
          <div class="text-xs text-gray-500 mt-2">
            收藏時間: {{ new Date(station.addedTime).toLocaleString() }}
          </div>
          
          <div class="card-actions justify-end mt-2">
            <button 
              @click="removeFromCollection(station.sno)"
              class="btn btn-sm btn-error"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              取消收藏
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>