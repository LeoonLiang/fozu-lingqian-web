<template>
  <div class="py-8 px-4">
    <!-- Step 0: 选择模式 -->
    <div v-if="step === 'choose'" class="flex flex-col items-center gap-6">
      <div class="grid grid-cols-2 gap-4 w-full max-w-md">
        <div class="antique-card flex flex-col items-center justify-center p-6 cursor-pointer group" @click="step = 'pray'">
          <img src="~/assets/css/签筒.png" alt="签筒" class="w-16 h-20 object-contain mb-3 group-hover:scale-105 transition-transform">
          <span class="text-lg font-bold text-xuanwu-text group-hover:text-xuanwu-red transition-colors">摇签求签</span>
          <span class="text-xs text-xuanwu-text-light mt-1">摇签 · 掷杯 · 解签</span>
        </div>
        <div class="antique-card flex flex-col items-center justify-center p-6 cursor-pointer group" @click="startJustThrow">
          <img src="~/assets/css/筊杯阳.png" alt="筊杯" class="w-16 h-16 object-contain mb-3 group-hover:scale-105 transition-transform">
          <span class="text-lg font-bold text-xuanwu-text group-hover:text-xuanwu-red transition-colors">直接掷杯</span>
          <span class="text-xs text-xuanwu-text-light mt-1">掷杯 · 问事</span>
        </div>
      </div>
    </div>

    <!-- Step 1: 求签 -->
    <div v-if="step === 'pray'" class="flex flex-col items-center gap-3">
      <p class="text-xl text-xuanwu-text font-semibold">心中默念所求之事</p>
      <p class="text-sm text-xuanwu-text-light mb-4">向佛祖虔诚求签</p>
      <div class="qiantong-wrap" :class="{ shaking: isShaking }" @click="startShake">
        <div class="qiantong">
          <img src="~/assets/css/签筒.png" alt="签筒" class="w-full h-full object-contain">
          <img v-if="showStick" src="~/assets/css/签.png" alt="签" class="qian-stick" :class="{ pop: stickPop }">
        </div>
      </div>
      <button v-if="!isShaking" class="btn-fortune-primary" @click="startShake">摇 签</button>
    </div>

    <!-- Step 2: 掷杯 -->
    <div v-if="step === 'throw'" class="flex flex-col items-center gap-3">
      <p class="text-xl text-xuanwu-text font-semibold">求得第 <span class="text-xuanwu-red font-bold text-2xl">{{ fortuneNumber }}</span> 签</p>
      <p class="text-sm text-xuanwu-text-light mb-4">需连续掷出三次圣杯方可解签</p>
      <p class="text-lg text-xuanwu-red font-bold">圣杯：{{ holyCount }} / 3</p>

      <!-- 筊杯区域 -->
      <div class="bwei-area">
        <div class="bwei-pair" :class="[animClass, { throwing: isThrowing }]">
          <div class="bwei bwei-back"></div>
          <div class="bwei bwei-front"></div>
        </div>
      </div>

      <!-- 结果文字 -->
      <div v-if="showResult" class="text-3xl font-bold my-2 text-center">
        <span :class="resultClass">{{ resultText }}</span>
        <p class="text-sm text-xuanwu-text-light mt-1">{{ resultMeaning }}</p>
      </div>

      <div class="flex gap-3 flex-wrap justify-center">
        <button v-if="!isThrowing && !showResult && holyCount < 3" class="btn-fortune-primary" @click="throwBwei">掷 杯</button>
        <button v-if="showResult && resultType === 'sheng' && holyCount < 3" class="btn-fortune-primary" @click="throwBwei">继续掷杯</button>
        <button v-if="showResult && resultType !== 'sheng'" class="btn-fortune-ghost" @click="resetAll">重新求签</button>
        <button v-if="holyCount >= 3" class="btn-fortune-gold" @click="goToFortune">查看签文</button>
      </div>
    </div>

    <!-- Step 3: 直接掷杯 -->
    <div v-if="step === 'just-throw'" class="flex flex-col items-center gap-3">
      <p class="text-xl text-xuanwu-text font-semibold">心中默念所求之事</p>
      <p class="text-sm text-xuanwu-text-light mb-4">掷杯问神明</p>

      <div class="bwei-area">
        <div class="bwei-pair" :class="[animClass, { throwing: isThrowing }]">
          <div class="bwei bwei-back"></div>
          <div class="bwei bwei-front"></div>
        </div>
      </div>

      <div v-if="showResult" class="text-3xl font-bold my-2 text-center">
        <span :class="resultClass">{{ resultText }}</span>
        <p class="text-sm text-xuanwu-text-light mt-1">{{ justThrowMeaning }}</p>
      </div>

      <div class="flex gap-3 flex-wrap justify-center">
        <button v-if="!isThrowing && !showResult" class="btn-fortune-primary" @click="throwBweiSimple">掷 杯</button>
        <button v-if="showResult" class="btn-fortune-primary" @click="throwBweiSimple">再掷一次</button>
        <button v-if="showResult" class="btn-fortune-ghost" @click="resetAll">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type ResultType = 'sheng' | 'xiao' | 'yin'

const step = ref<'choose' | 'pray' | 'throw' | 'just-throw'>('choose')
const isShaking = ref(false)
const showStick = ref(false)
const stickPop = ref(false)
const fortuneNumber = ref(1)
const holyCount = ref(0)
const isThrowing = ref(false)
const showResult = ref(false)
const resultType = ref<ResultType>('sheng')
// 三种落地动画随机选一种
const animClass = ref('')

const resultText = computed(() => {
  if (resultType.value === 'sheng') return '圣杯'
  if (resultType.value === 'xiao') return '笑杯'
  return '阴杯'
})

const resultClass = computed(() => {
  if (resultType.value === 'sheng') return 'text-xuanwu-red'
  if (resultType.value === 'xiao') return 'text-xuanwu-gold'
  return 'text-xuanwu-text-light'
})

const resultMeaning = computed(() => {
  if (resultType.value === 'sheng') return '神明允许，请继续掷杯确认'
  if (resultType.value === 'xiao') return '神明笑而不答，需重新求签'
  return '神明不允许，需重新求签'
})

const startShake = () => {
  if (isShaking.value) return
  isShaking.value = true
  showStick.value = false
  stickPop.value = false

  setTimeout(() => {
    showStick.value = true
    setTimeout(() => { stickPop.value = true }, 100)
  }, 1200)

  setTimeout(() => {
    isShaking.value = false
    fortuneNumber.value = Math.floor(Math.random() * 51) + 1
    step.value = 'throw'
    holyCount.value = 0
    showResult.value = false
  }, 2200)
}

const throwBwei = () => {
  if (isThrowing.value) return
  isThrowing.value = true
  showResult.value = false
  animClass.value = ''

  nextTick(() => {
    const r = Math.random()
    resultType.value = r < 0.5 ? 'sheng' : r < 0.75 ? 'xiao' : 'yin'
    animClass.value = resultType.value === 'sheng' ? 'land-a' : resultType.value === 'xiao' ? 'land-b' : 'land-c'

    setTimeout(() => {
      isThrowing.value = false
      showResult.value = true

      if (resultType.value === 'sheng') {
        holyCount.value++
      } else {
        holyCount.value = 0
      }
    }, 1100)
  })
}

const goToFortune = () => {
  navigateTo(`/${String(fortuneNumber.value).padStart(2, '0')}`)
}

const resetAll = () => {
  step.value = 'choose'
  isShaking.value = false
  showStick.value = false
  stickPop.value = false
  holyCount.value = 0
  showResult.value = false
  animClass.value = ''
}

const startJustThrow = () => {
  step.value = 'just-throw'
  showResult.value = false
  animClass.value = ''
}

const throwBweiSimple = () => {
  if (isThrowing.value) return
  isThrowing.value = true
  showResult.value = false
  animClass.value = ''

  nextTick(() => {
    const r = Math.random()
    resultType.value = r < 0.5 ? 'sheng' : r < 0.75 ? 'xiao' : 'yin'
    animClass.value = resultType.value === 'sheng' ? 'land-a' : resultType.value === 'xiao' ? 'land-b' : 'land-c'

    setTimeout(() => {
      isThrowing.value = false
      showResult.value = true
    }, 1100)
  })
}

const justThrowMeaning = computed(() => {
  if (resultType.value === 'sheng') return '圣杯 — 神明允许'
  if (resultType.value === 'xiao') return '笑杯 — 神明笑而不答'
  return '阴杯 — 神明不允许'
})
</script>

<style scoped>
/* 签筒 */
.qiantong-wrap {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.qiantong {
  position: relative;
  width: 160px;
  height: 220px;
}

.qian-stick {
  position: absolute;
  bottom: 60%;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  width: 30px;
  opacity: 0;
  transition: all 0.5s ease-out;
  z-index: 2;
}

.qian-stick.pop {
  opacity: 1;
  transform: translateX(-50%) translateY(-30px) rotate(-15deg);
}

.shaking .qiantong {
  animation: shakeQiantong 0.15s infinite alternate;
}

@keyframes shakeQiantong {
  0% { transform: rotate(-4deg) translateY(0); }
  50% { transform: rotate(4deg) translateY(-3px); }
  100% { transform: rotate(-3deg) translateY(1px); }
}
</style>

<style scoped>
/* 筊杯区域 */
.bwei-area {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 1.5rem 0;
}

.bwei-pair {
  position: relative;
  width: 100%;
  height: 100%;
}

.bwei {
  position: absolute;
  width: 80px;
  height: 80px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.3s;
}

/* 阳面(平面) 在后 */
.bwei-back {
  background-image: url('~/assets/css/筊杯阳.png');
  top: 50%;
  left: 50%;
  transform: translate(-60%, -45%) rotate(-15deg);
}

/* 阴面(凸面) 在前 - 需要旋转180deg才能和阳面对齐 */
.bwei-front {
  background-image: url('~/assets/css/筊杯阴.png');
  top: 50%;
  left: 50%;
  transform: translate(-40%, -55%) rotate(190deg);
  z-index: 1;
}

/* 抛起动画 */
.bwei-pair.throwing .bwei-back,
.bwei-pair.throwing .bwei-front {
  animation: flyUp 0.6s ease-in-out forwards;
}

@keyframes flyUp {
  0% { opacity: 1; }
  50% { transform: translate(-50%, -250%) rotate(360deg); opacity: 0.8; }
  100% { transform: translate(-50%, -280%) rotate(540deg); opacity: 0; }
}

/* 三种落地动画 - 圣杯:一阴一阳 */
.bwei-pair.land-a .bwei-back {
  animation: landA-back 0.5s 0.6s ease-out forwards;
  opacity: 0;
}
.bwei-pair.land-a .bwei-front {
  animation: landA-front 0.5s 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes landA-back {
  0% { opacity: 0; transform: translate(-80%, -200%) rotate(0deg); }
  100% { opacity: 1; transform: translate(-80%, -45%) rotate(-20deg); }
}
@keyframes landA-front {
  0% { opacity: 0; transform: translate(-20%, -200%) rotate(180deg); }
  100% { opacity: 1; transform: translate(-20%, -55%) rotate(195deg); }
}

/* 笑杯:两阳 */
.bwei-pair.land-b .bwei-back {
  animation: landB-back 0.5s 0.6s ease-out forwards;
  opacity: 0;
}
.bwei-pair.land-b .bwei-front {
  animation: landB-front 0.5s 0.6s ease-out forwards;
  opacity: 0;
  background-image: url('~/assets/css/筊杯阳.png');
}

@keyframes landB-back {
  0% { opacity: 0; transform: translate(-70%, -200%) rotate(0deg); }
  100% { opacity: 1; transform: translate(-70%, -45%) rotate(-10deg); }
}
@keyframes landB-front {
  0% { opacity: 0; transform: translate(-30%, -200%) rotate(0deg); }
  100% { opacity: 1; transform: translate(-30%, -55%) rotate(20deg); }
}

/* 阴杯:两阴 */
.bwei-pair.land-c .bwei-back {
  animation: landC-back 0.5s 0.6s ease-out forwards;
  opacity: 0;
  background-image: url('~/assets/css/筊杯阴.png');
}
.bwei-pair.land-c .bwei-front {
  animation: landC-front 0.5s 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes landC-back {
  0% { opacity: 0; transform: translate(-75%, -200%) rotate(180deg); }
  100% { opacity: 1; transform: translate(-75%, -45%) rotate(155deg); }
}
@keyframes landC-front {
  0% { opacity: 0; transform: translate(-25%, -200%) rotate(180deg); }
  100% { opacity: 1; transform: translate(-25%, -55%) rotate(192deg); }
}
</style>
