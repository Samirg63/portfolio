<script setup lang="ts">
    import truncate from 'truncate-html';
    const description:string = `Site desenvolvido em ReactJs + Vite, com o intuíto de apresentar informações precisas sobre o clima, conta com função como geolocalização, pesquisa de cidades, previsões futuras, e marcadores que facilitam com que você encontre suas cidades favoritas.`


    function formatDescription(text:string):string{
        return truncate(text,270,{reserveLastWord:true});
    }
</script>

<template>
    <div class="box dark:bg-zinc-800 bg-gray-100  w-full min-h-15 border rounded-lg dark:border-zinc-600 border-gray-400 flex flex-col cursor-pointer hover:scale-105">
        <img src="/images/Weather.png" alt="" class="h-30 object-cover rounded-tl-[inherit] rounded-tr-[inherit]">
        <div class="px-4 py-2">
            <h3 class="font-semibold">Weather app</h3>
            <p class="text-sm ">{{ formatDescription(description) }}</p>
        </div>
        
    </div>
</template>

<style scoped>
    

    .box:hover{
        filter:drop-shadow(0 0 4px #59168b);
    }
</style>