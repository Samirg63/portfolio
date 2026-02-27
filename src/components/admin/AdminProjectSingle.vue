<script setup lang="ts">
    import truncate from 'truncate-html'

    interface Props{
        name:string,
        desc:string,
        images:string,
        id:number
    }

    const props = defineProps<Props>()
    const images = JSON.parse(props.images)
    
    
    


    function formatDescription(text:string):string{
        return truncate(text,270,{reserveLastWord:true});
    }
</script>

<template>
    <div class="box dark:bg-zinc-800 bg-gray-100  w-full min-h-15 border rounded-lg dark:border-zinc-600 border-gray-400 flex flex-col cursor-pointer hover:scale-105">
        <img :src="images[0].url as string" alt="" class="h-30 object-cover rounded-tl-[inherit] rounded-tr-[inherit]">
        <div class="px-4 py-2 min-h-40">
            <h3 class="font-semibold">{{ props.name }}</h3>
            <p class="text-sm" v-html="formatDescription(props.desc)"></p>
        </div>
        <div class="completed text-center   py-1 rounded-bl-[inherit] rounded-br-[inherit]">
            <span >Concluído</span>
        </div>
    </div>
</template>

<style scoped>
    .completed{
        background-color: #9ae60080;
    }

    .onGoing{
        background-color: rgba(43, 127, 255,.5);
    }

    .box:hover{
        filter:drop-shadow(0 0 4px #59168b);
    }
</style>