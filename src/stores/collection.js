import { defineStore } from 'pinia'

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    collections: []
  }),
  
  getters: {
    getCollectionCount: (state) => state.collections.length,
    isCollected: (state) => (sno) => {
      return state.collections.some(station => station.sno === sno)
    }
  },
  
  actions: {
    // 載入localStorage中的收藏資料
    loadCollections() {
      const savedCollections = localStorage.getItem('ubike-collections')
      if (savedCollections) {
        this.collections = JSON.parse(savedCollections)
      }
    },
    
    // 保存收藏資料到localStorage
    saveCollections() {
      localStorage.setItem('ubike-collections', JSON.stringify(this.collections))
    },
    
    // 添加收藏
    addCollection(station) {
      if (!this.isCollected(station.sno)) {
        this.collections.push({
          sno: station.sno,
          sna: station.sna,
          sarea: station.sarea,
          ar: station.ar,
          available_rent_bikes: station.available_rent_bikes,
          available_return_bikes: station.available_return_bikes,
          addedTime: new Date().toISOString()
        })
        this.saveCollections()
      }
    },
    
    // 移除收藏
    removeCollection(sno) {
      const index = this.collections.findIndex(station => station.sno === sno)
      if (index > -1) {
        this.collections.splice(index, 1)
        this.saveCollections()
      }
    },
    
    // 清空所有收藏
    clearCollections() {
      this.collections = []
      this.saveCollections()
    }
  }
})
