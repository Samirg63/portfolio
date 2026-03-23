<script setup lang="ts">
import type { IHardskillsGroupsData } from '@/utils/interfaces';

    
    const props = defineProps<{data:IHardskillsGroupsData}>()
</script>

<template>
    <section class="border rounded-lg border-zinc-700 ">
        <div class="p-4">
  
        <h3 class="font-semibold text-2xl">{{ props.data.name }}:</h3>
        <div class="min-h-24">
            <template v-for="(skills,index) in props.data.hardskills" :key="skills.id">
            <div class=" mt-4 box cursor-default" v-if="index <=4">
                <div class="flex items-center gap-2">
                    <v-icon :name="skills.icon" scale="2"/>
                    
                    <h4 class="font-semild text-xl">{{ skills.name }}</h4>
                </div>
                <div class="divider w-0 border-b"></div>
            </div> 
            </template>          
        </div>
        </div>
        
            <UPopover mode="hover" :content="{side:'right'}" id="showMore">
                <div v-if="props.data.hardskills?.length! > 4" class=" p-4 mt-8 cursor-pointer flex items-center justify-between">
                    <h4 class=" font-semild text-xl dark:text-gray-400 text-zinc-800">Veja mais...</h4>
                    <v-icon class=" " name="bi-chevron-double-right"/>
                </div>

                <template #content  >
                    <div class="flex items-center gap-2 p-1.5 -ml-1.5 dark:bg-zinc-800 bg-gray-300 border dark:border-zinc-600 border-gray-400 rounded-md">
                        <template v-for="(skills,index) in props.data.hardskills" :key="skills.id">
                            <UTooltip v-if="index > 4" :text="skills.name" :content="{side:'top'}" arrow :ui="{background: 'bg-indigo-600'}">
                                
                                <div class="dark:hover:bg-zinc-600 hover:bg-gray-100 p-1.5 rounded-md" >
                                    <v-icon v-if="skills.icon" :name="skills.icon" scale="2"/>
                                    <h2 v-else class=" w-9.5 h-9.5 flex items-center justify-center text-2xl font-light capitalize">{{ skills.name.slice(0,2).toLowerCase() }}</h2>
                                </div>        
                            </UTooltip>
                        </template>
                      
                    </div>
                </template>
            </UPopover>          
        
        
    </section>
</template>


<style scoped>
    

   h4{
    user-select: none;
   }

    .divider{
        transition: .2s;
    }

    .box:hover .divider{
        width: 100%;
    }

    #showMore{
        transform: translateX(100%);
    }
</style>