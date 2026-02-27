<script setup lang="ts">
    

</script>

<template>
    <section class="border rounded-lg border-zinc-700 ">
        <div class="p-4">
  
        <h3 class="font-semibold text-2xl">Frameworks:</h3>
        
        <div class=" mt-4 box cursor-default">
            <div class="flex items-center gap-2">
                <v-icon name="co-react" scale="2"/>
                <h4 class="font-semild text-xl">React</h4>
            </div>
            <div class="divider w-0 border-b"></div>
        </div>
        <div class=" mt-4 box cursor-default">
            <div class="flex items-center gap-2">
                <v-icon name="co-vue-js" scale="2"/>
                <h4 class="font-semild text-xl">Vue</h4>
            </div>
            <div class="divider w-0 border-b"></div>
        </div>
        <div class="mt-4 box cursor-default">
            <div class="flex items-center gap-2">
                <v-icon name="co-angular" scale="2"/>
                <h4 class="font-semild text-xl">Angular</h4>
            </div>
            <div class="divider w-0 border-b"></div>
        </div>
        </div>
        
            <UPopover mode="hover" :content="{side:'right'}" id="showMore">
                <div class=" p-4 mt-8 cursor-pointer flex items-center justify-between">
                    <h4 class=" font-semild text-xl dark:text-gray-400 text-zinc-800">Veja mais...</h4>
                    <v-icon class=" " name="bi-chevron-double-right"/>
                </div>

                <template #content  >
                    <div class="flex items-center gap-2 p-1.5 -ml-1.5 dark:bg-zinc-800 bg-gray-300 border dark:border-zinc-600 border-gray-400 rounded-md">
                        <UTooltip text="Css5" :content="{side:'top'}" arrow :ui="{background: 'bg-indigo-600'}">

                                <div class="dark:hover:bg-zinc-600 hover:bg-gray-100 p-1.5 rounded-md" >
                                    <v-icon name="vi-file-type-css" scale="2"/>
                                </div>
                            
                        </UTooltip>
                        <UTooltip text="Css5" :content="{side:'top'}" arrow :ui="{background: 'bg-indigo-600'}">

                                <div class="dark:hover:bg-zinc-600 hover:bg-gray-100 p-1.5 rounded-md" >
                                    <v-icon name="vi-file-type-css" scale="2"/>
                                </div>
                            
                        </UTooltip>
                        <UTooltip text="Css5" :content="{side:'top'}" arrow :ui="{background: 'bg-indigo-600'}">

                                <div class="dark:hover:bg-zinc-600 hover:bg-gray-100 p-1.5 rounded-md" >
                                    <v-icon name="vi-file-type-css" scale="2"/>
                                </div>
                            
                        </UTooltip>
                        
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