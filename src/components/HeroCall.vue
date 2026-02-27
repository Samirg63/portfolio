<script setup lang="ts"></script>

<template>
    <section class="flex items-center space-x-8 p-12">
        <img src="https://placehold.co/300" alt="" class="rounded-full">
        <div class="space-y-4">
            
                <h1 class="text-6xl">&lt;Samir Gomes/&gt;  </h1>
                
            
            <div class="ml-10 -mr-10 text-box">
                <p class="font-light">Um Web Developer disposto a transformar ideias em experiências digitais de alto impacto.</p>
                <div class="flex items-center gap-4 mt-4">
                    <a class="block dark:bg-zinc-900 bg-gray-100 border-fuchsia-700 text-fuchsia-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" href="https://github.com/Samirg63"><v-icon name="bi-github"/>  Github</a>
                    <a class="block dark:bg-zinc-900 bg-gray-100 border-blue-700 text-blue-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" href="https://www.linkedin.com/in/samir-gomes-de-sá-395453247/"><v-icon name="bi-linkedin"/> LinkedIn</a>
                </div>
                <!-- <div class="divider -mr-15 border-b mt-2 "></div> -->
            </div>
        </div>
    </section>
</template>

<style scoped>
    img{
        filter: drop-shadow(0 0 10px rgba(106, 114, 130,.8));
    }

    /*.divider{
        border-color: rgba(0,0,0,.0);
        border-radius: 50%;
        box-shadow: 0 12px 10px #59168b;
        height: 5px;
    }*/

</style>