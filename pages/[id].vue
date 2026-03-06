<template>
  <div class="container">
    <div class="nav-header">
      <NuxtLink to="/" class="back">← 返回列表</NuxtLink>
    </div>

    <div v-if="pending" class="loading">加载中...</div>
    <div v-else-if="error" class="error">请求失败，请检查网络或签号</div>
    
    <div v-else-if="data" class="detail-wrapper">
      <!-- 顶部核心信息卡片 -->
      <header class="main-header card">
        <div class="stick-id">第 {{ data.签号 }} 签</div>
        <h1 class="stick-title">{{ data.签名 }}</h1>
        <div class="stick-meta">
          <span class="meta-tag type">{{ data.签文类型 }}</span>
          <span class="meta-tag">{{ data.卦象 }}</span>
          <span class="meta-tag">{{ data.生肖 }}</span>
        </div>
      </header>

      <!-- 核心签文区 (始终显示) -->
      <section class="core-section card">
        <div class="poem-box">
          <h3>诗曰</h3>
          <p class="poem-text">{{ data.签文简介.诗曰 }}</p>
          <p class="poem-desc">{{ data.签文简介.戏文 }}</p>
        </div>
        
        <div class="meaning-box">
          <h3>内兆</h3>
          <p>{{ data.签文简介.内兆 }}</p>
        </div>

        <div class="images-box">
          <img :src="getImageUrl(id, 1)" alt="签文图1" loading="lazy" />
          <img :src="getImageUrl(id, 2)" alt="签文图2" loading="lazy" />
        </div>
      </section>

      <!-- 分类筛选导航 -->
      <div class="category-nav">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="['nav-btn', { active: activeCategory === cat.id }]"
          @click="activeCategory = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- 分类内容区 -->
      <div class="content-area">
        
        <!-- 家宅 -->
        <section v-show="showSection('home')" class="section-card card">
          <h3 class="section-title">🏠 家宅</h3>
          <div class="info-group">
            <div class="info-row"><strong>签文：</strong>{{ data.家宅运势.签文 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.家宅运势.解曰 }}</div>
          </div>
        </section>

        <!-- 岁君 -->
        <section v-show="showSection('age')" class="section-card card">
          <h3 class="section-title">📅 岁君</h3>
          <div class="info-group">
             <div class="info-row center-text"><strong>{{ data.岁君签.总诗 }}</strong></div>
          </div>
          <div class="age-grid mt-4">
            <div v-for="age in data.岁君签.年龄运势" :key="age.年龄" class="age-item">
              <div class="age-circle">{{ age.年龄 }}</div>
              <div class="age-detail">
                <div class="male">男: {{ age.男 }}</div>
                <div class="female">女: {{ age.女 }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 生意 -->
        <section v-show="showSection('business')" class="section-card card">
          <h3 class="section-title">💰 生意</h3>
          <div class="info-group">
            <div class="info-row"><strong>生意：</strong>{{ data.生意.生意 }}</div>
            <div class="info-row"><strong>开铺：</strong>{{ data.生意.开铺 }}</div>
            <div class="info-row"><strong>合伙：</strong>{{ data.生意.合伙 }}</div>
            <div class="info-row"><strong>置货：</strong>{{ data.生意.置货 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.生意.生意解曰 }}</div>
          </div>
        </section>

        <!-- 谋望求财 -->
        <section v-show="showSection('money')" class="section-card card">
          <h3 class="section-title">💎 谋望求财</h3>
          <div class="info-group">
            <div class="info-row"><strong>谋望：</strong>{{ data.谋望求财.谋望 }}</div>
            <div class="info-row"><strong>求财：</strong>{{ data.谋望求财.求财 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.谋望求财.谋望解曰 }}</div>
          </div>
        </section>

        <!-- 学艺功名 -->
        <section v-show="showSection('study')" class="section-card card">
          <h3 class="section-title">🎓 学艺功名</h3>
          <div class="info-group">
            <div class="info-row"><strong>学艺：</strong>{{ data.学艺功名.学艺 }}</div>
            <div class="info-row"><strong>功名：</strong>{{ data.学艺功名.功名 }}</div>
          </div>
        </section>

        <!-- 行舟六畜 -->
        <section v-show="showSection('stock')" class="section-card card">
          <h3 class="section-title">🐔 行舟六畜</h3>
          <div class="info-group">
            <div class="info-row"><strong>行舟：</strong>{{ data.行舟六畜.行舟 }}</div>
            <div class="info-row"><strong>六畜：</strong>{{ data.行舟六畜.六畜 }}</div>
            <div class="info-row"><strong>猪羊：</strong>{{ data.行舟六畜.猪羊 }}</div>
            <div class="info-row"><strong>草龙：</strong>{{ data.行舟六畜.草龙 }}</div>
            <div class="info-row"><strong>三鸟：</strong>{{ data.行舟六畜.三鸟 }}</div>
            <div class="info-row"><strong>田蚕：</strong>{{ data.行舟六畜.田蚕 }}</div>
          </div>
        </section>

        <!-- 移徙 -->
        <section v-show="showSection('move')" class="section-card card">
          <h3 class="section-title">🚚 移徙</h3>
          <div class="info-group">
            <div class="info-row">{{ data.移徙.移徙 }}</div>
          </div>
        </section>

        <!-- 行人 -->
        <section v-show="showSection('walker')" class="section-card card">
          <h3 class="section-title">🚶 行人</h3>
          <div class="info-group">
            <div class="info-row"><strong>诗：</strong>{{ data.行人.诗 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.行人.解曰 }}</div>
          </div>
        </section>

        <!-- 婚姻 -->
        <section v-show="showSection('marriage')" class="section-card card">
          <h3 class="section-title">❤️ 婚姻</h3>
          <div class="info-group">
            <div class="info-row">{{ data.婚姻.婚姻 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.婚姻.解曰 }}</div>
          </div>
        </section>

        <!-- 官讼 -->
        <section v-show="showSection('law')" class="section-card card">
          <h3 class="section-title">⚖️ 官讼</h3>
          <div class="info-group">
            <div class="info-row">{{ data.官讼.官讼 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.官讼.解曰 }}</div>
          </div>
        </section>

        <!-- 失物 -->
        <section v-show="showSection('lost')" class="section-card card">
          <h3 class="section-title">🔍 失物</h3>
          <div class="info-group">
            <div class="info-row">{{ data.失物.失物 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.失物.解曰 }}</div>
          </div>
        </section>

        <!-- 占病 -->
        <section v-show="showSection('sick')" class="section-card card">
          <h3 class="section-title">💊 占病</h3>
          <div class="info-group">
            <div class="info-row">{{ data.占病.占病 }}</div>
            <div class="info-row highlight"><strong>解曰：</strong>{{ data.占病.解曰 }}</div>
          </div>
        </section>

        <!-- 其他 -->
        <section v-show="showSection('other')" class="section-card card">
          <h3 class="section-title">🔮 其他</h3>
          <div class="info-group">
            <div class="info-row" v-for="(val, key) in data.其他" :key="key">
              <strong>{{ key }}：</strong>{{ val }}
            </div>
            <div class="info-row" v-if="activeCategory === 'other' || activeCategory === 'all'">
              <strong>出外：</strong>{{ data.出外.出外 }}
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FortuneStick } from '~/types/lingqian'

const route = useRoute()
const id = route.params.id as string

const DATA_URL = `https://cdn.jsdelivr.net/gh/LeoonLiang/xuanwu-fozu-lingqian@main/data/${id}.json`

const { data, pending, error } = await useFetch<FortuneStick>(DATA_URL, {
  key: `stick-${id}`
})

// 分类配置
const categories = [
  { id: 'all', label: '全部' },
  { id: 'home', label: '家宅' },
  { id: 'age', label: '岁君' },
  { id: 'business', label: '生意' },
  { id: 'money', label: '谋望求财' },
  { id: 'study', label: '学艺功名' },
  { id: 'stock', label: '行舟六畜' },
  { id: 'move', label: '移徙' },
  { id: 'walker', label: '行人' },
  { id: 'marriage', label: '婚姻' },
  { id: 'law', label: '官讼' },
  { id: 'lost', label: '失物' },
  { id: 'sick', label: '占病' },
  { id: 'other', label: '其他' },
]

const activeCategory = ref('all')

function showSection(catId: string) {
  return activeCategory.value === 'all' || activeCategory.value === catId
}

// 辅助函数：生成图片 URL
function getImageUrl(id: string, index: number) {
  return `https://cdn.jsdelivr.net/gh/LeoonLiang/xuanwu-fozu-lingqian@main/image/${parseInt(id)}_${index}.jpg`
}
</script>

<style scoped>
/* 全局容器 */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.nav-header { margin-bottom: 12px; }
.back { color: #555; text-decoration: none; font-weight: 500; font-size: 0.95rem; }

/* 通用卡片样式 */
.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* 顶部信息 */
.main-header { text-align: center; background: linear-gradient(135deg, #fff5e6 0%, #fff 100%); }
.stick-id { font-size: 0.9rem; color: #888; letter-spacing: 1px; }
.stick-title { margin: 8px 0 12px; font-size: 1.8rem; color: #333; }
.stick-meta { display: flex; justify-content: center; gap: 8px; }
.meta-tag { background: rgba(0,0,0,0.05); padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; color: #666; }
.meta-tag.type { background: #e6f7ff; color: #0077fa; font-weight: bold; }

/* 核心区 */
.core-section h3 { margin: 0 0 12px; font-size: 1.1rem; color: #333; border-left: 4px solid #faad14; padding-left: 8px; }
.poem-box { text-align: center; margin-bottom: 24px; }
.poem-text { font-size: 1.1rem; line-height: 1.6; color: #333; font-weight: 500; margin-bottom: 8px; }
.poem-desc { color: #888; font-size: 0.9rem; font-style: italic; }
.meaning-box { background: #f9f9f9; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
.meaning-box p { margin: 0; color: #555; line-height: 1.5; }
.images-box { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; }
.images-box img { height: 120px; border-radius: 8px; border: 1px solid #eee; }

/* 导航条 */
.category-nav {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 4px;
  scrollbar-width: none; /* Firefox */
}
.category-nav::-webkit-scrollbar { display: none; }
.nav-btn {
  white-space: nowrap;
  padding: 8px 16px;
  border: none;
  background: #fff;
  border-radius: 20px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  transition: all 0.2s;
}
.nav-btn.active {
  background: #333;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* 板块通用 */
.section-title { margin: 0 0 16px; font-size: 1.1rem; color: #333; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f0f0f0; padding-bottom: 8px; }
.mt-4 { margin-top: 16px; }

/* 信息列表布局 */
.info-group { display: flex; flex-direction: column; gap: 12px; }
.info-row { font-size: 1rem; color: #333; line-height: 1.6; }
.info-row strong { color: #555; font-weight: 600; margin-right: 4px; }
.info-row.highlight { color: #d46b08; background: #fff7e6; padding: 8px 12px; border-radius: 6px; font-weight: 500; }
.info-row.center-text { text-align: center; }

/* 岁君 */
.age-poem { text-align: center; margin-bottom: 16px; font-weight: 500; }
.age-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.age-item { display: flex; align-items: center; background: #f9f9f9; padding: 8px; border-radius: 8px; gap: 10px; }
.age-circle { width: 32px; height: 32px; background: #333; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; flex-shrink: 0; }
.age-detail { font-size: 0.85rem; color: #555; }
</style>
