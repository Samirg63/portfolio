<script setup lang="ts">

import { ref,onMounted } from 'vue';
import HardSkillCardSingle from './HardSkillCardSingle.vue';
import type { ErrorResponse, IHardskillsGroupsData } from '@/utils/interfaces';
import { getHardskillsGroupsData } from '@/services/hardskillsGroupsServices';
import SkillsPlaceholder from './placeholders/SkillsPlaceholder.vue';

    const target = ref(null)
    const targetIsVisible = ref(false)
    let observer;
    const hardskillsGroupsData = ref<IHardskillsGroupsData[]>([])

onMounted(async ()=>{
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
        try {
            hardskillsGroupsData.value = await getHardskillsGroupsData();
            
            
            
        } catch (error:unknown) {   
            if((error as ErrorResponse)){
            console.log((error as ErrorResponse).response.data.error)
        }
        }
  
})

</script>

<template>
    <section class="p-12">
        <h2 class="font-semibold text-3xl">Minhas Especialidades:</h2>
        <div  class="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5 mt-6" ref="target">
            <TransitionGroup v-if="hardskillsGroupsData.length" name="hardskillList" >
                <template v-for="(skillGroup,index) in hardskillsGroupsData" :key="index">
                    <HardSkillCardSingle v-if="targetIsVisible" :data="skillGroup" :id="'box'+index"/>
                </template>
            </TransitionGroup>
            <SkillsPlaceholder v-else/>
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

    #box4{
        transition-delay: 0.6s;
    }
</style>