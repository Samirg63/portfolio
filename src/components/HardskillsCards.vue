<script setup lang="ts">

import { ref,onMounted } from 'vue';
import HardSkillCardSingle from './HardSkillCardSingle.vue';

const target = ref(null)
const targetIsVisible = ref(false)
let observer;

onMounted(()=>{
    observer = new IntersectionObserver(
    (entries) => {
      
      if(!targetIsVisible.value){
          targetIsVisible.value = entries[0]!.isIntersecting;
        }
    },
    {
      root: null, 
      threshold: 0.5, // 10% of the element must be visible
    }
  );

  if (target.value) {
    observer.observe(target.value);
  }
})

</script>

<template>
    <section class="p-12">
        <h2 class="font-semibold text-3xl">Minhas Especialidades:</h2>
        <div class="grid grid-cols-4 gap-5 mt-6" ref="target">
            <TransitionGroup name="hardskillList">
                <HardSkillCardSingle v-if="targetIsVisible" key="0" id="box1"/>
                <HardSkillCardSingle v-if="targetIsVisible" key="1" id="box2"/>
                <HardSkillCardSingle v-if="targetIsVisible" key="2" id="box3"/>
            </TransitionGroup>
        </div>
    </section>
</template>

<style scoped>
    .hardskillList-enter-active,
    .hardskillList-leave-active {
    transition: all 0.5s ease;
    }

    .hardskillList-enter-from,
    .hardskillList-leave-to {
    opacity: 0;
    transform: translateX(-100%);
    }


    #box2{
        transition-delay: 0.2s;
    }

    #box3{
        transition-delay: 0.4s;
    }
</style>