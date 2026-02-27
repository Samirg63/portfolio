<script lang="ts" setup>


    
    const {type = 'default',scale = 1,pointer = true} = defineProps<{
        type?:string,
        scale?:number,
        pointer?:boolean
        name:string,
        bgcolor:string
    }>()
    

</script>

<template >
    <div id="tagWrapper" @click="$emit('tagClick')" :style="{backgroundColor: bgcolor,scale:scale}" class="relative select-none flex items-center py-1 px-3 rounded-md duration-200 "
    
    :class="{'cursor-pointer': pointer, 'hover:opacity-70':(type != 'removable')}"
    >
        <p class="text-gray-200">{{ name }}</p>
        <div  :hidden="(type !== 'removable')" @click="$emit('deleteBtn')" class="absolute top-0.5 right-0.5 translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded-full cursor-pointer w-5 h-5 flex items-center justify-between opacity-0 pointer-events-none duration-200" >
            <v-icon fill="#27272a" name="bi-trash-fill" class="w-full" scale="0.8"></v-icon>
        </div>
    </div>
</template>

<style scoped>
    #tagWrapper:hover >div{
        opacity: 100%;
        pointer-events: all;
    }
</style>