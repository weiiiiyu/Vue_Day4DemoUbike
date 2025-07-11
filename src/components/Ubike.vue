<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useCollectionStore } from '../stores/collection'

const localInput = ref("")
const ubikeStations = ref([])
const isLoading = ref(false)

// 使用Pinia store
const collectionStore = useCollectionStore()

// 組件掛載時載入收藏資料
onMounted(() => {
  collectionStore.loadCollections()
})

// 切換收藏狀態
const toggleCollection = (station) => {
  if (collectionStore.isCollected(station.sno)) {
    collectionStore.removeCollection(station.sno)
  } else {
    collectionStore.addCollection(station)
  }
}

const searchUbike = async () => {
  const content = localInput.value
  
  if (content != "") {
    isLoading.value = true
    await getUbikeApi(content)
    localInput.value = ""
    isLoading.value = false
  }
}

const getUbikeApi = async (searchKeyword) => {
  try {
    const { data } = await axios.get("https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json")
    
    // 篩選包含搜索關鍵詞的站點（在ar或sarea欄位中）
    const filteredStations = data.filter(station => 
      station.ar.includes(searchKeyword) || 
      station.sarea.includes(searchKeyword)
    )
    
    ubikeStations.value = filteredStations
  } catch (error) {
    console.error('獲取Ubike資料失敗:', error)
    ubikeStations.value = []
  }
}
</script>

<template>
  <h1 class="text-3xl font-bold text-center my-4">Ubike Stations</h1>

  <section class="container mx-auto p-4">
    <h1 class="text-2xl mb-4">輸入地區</h1>
    <div class="my-2 flex gap-2">
      <input
        type="text"
        @keyup.enter="searchUbike"
        v-model.trim="localInput"
        class="input input-bordered flex-1"
        placeholder="請輸入地區名稱（例如：大安區、信義區）"
      />
      <button @click="searchUbike" class="btn btn-primary" :disabled="isLoading">
        <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
        {{ isLoading ? '查詢中...' : '查詢' }}
      </button>
    </div>
    <div class="divider"></div>

    <!-- 顯示搜索結果 -->
    <div v-if="ubikeStations.length > 0" class="mb-4">
      <h2 class="text-xl font-semibold mb-2">找到 {{ ubikeStations.length }} 個站點</h2>
    </div>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="station in ubikeStations" 
        :key="station.sno"
        class="card bg-base-100 shadow-md border"
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
          
          <!-- 額外資訊 -->
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
          
          <div class="card-actions justify-end mt-2">
            <button 
              @click="toggleCollection(station)"
              class="btn btn-sm"
              :class="collectionStore.isCollected(station.sno) ? 'btn-error' : 'btn-outline'"
            >
              <svg v-if="collectionStore.isCollected(station.sno)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {{ collectionStore.isCollected(station.sno) ? '取消收藏' : '加入收藏' }}
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 無搜索結果 -->
    <div v-if="ubikeStations.length === 0 && !isLoading" class="text-center py-8">
      <p class="text-gray-500">請輸入地區名稱來搜索Ubike站點</p>
    </div>
  </section>

</template>

<style scoped>

</style>
