<script setup lang="ts">
import { getUserData } from '@/services/userService';
import type { ErrorResponse, IMenuDrawer, IUserData } from '@/utils/interfaces';
import { inject, onMounted, ref } from 'vue';




    const userData = ref<IUserData|null>(null)
    const {drawerOpen}:IMenuDrawer = inject('menuDrawer')!


    onMounted(async ()=>{
            try {
                userData.value = await getUserData();
            } catch (error:unknown) {
                if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
            }



            
        })


    function scrollTo(id:string){
        
        const element = document.getElementById(id)
        if(!element){
            return null
        }
        
        document.getElementById('mainContent')?.scrollTo({
            top:element.offsetTop - 30,
            behavior:'smooth'
        })
       
    }
</script>
<template>
    <!-- contem: foto de usuario, links de scrollagem -->
  <aside class="w-65 h-full border-r dark:border-gray-600 border-gray-400 py-12 dark:bg-[#272b31] bg-neutral-300 max-lg:hidden">
    
    
    <img v-if="userData?.image" :src="JSON.parse(userData.image).url" alt="" class="rounded-full mx-auto w-37.5 h-37.5">
    <img v-else src="/defaults/defaultUser.webp" alt="" class="rounded-full mx-auto w-37.5 h-37.5">
    <nav class="flex flex-col mt-24 text-lg space-y-4 w-50 mx-auto">
        <button @click="scrollTo('home')"  class="navBtn cursor-pointer text-center">
            <p>Home</p>
            <div class="divider w-0 border-b"></div>
        </button>
        <button @click="scrollTo('projects')"  class="navBtn cursor-pointer text-center">
            <p>Projetos</p>
            <div class="divider w-0 border-b"></div>
        </button >
        <button @click="scrollTo('about')" class="navBtn cursor-pointer text-center">
            <p>Sobre</p>
            <div class="divider w-0 border-b"></div>
        </button>
        <button @click="scrollTo('contact')"  class="navBtn cursor-pointer text-center">
            <p>Contato</p>
            <div class="divider w-0 border-b"></div>
        </button>
    </nav>
  </aside>
  <UDrawer v-model:open="drawerOpen" direction="left" :handle="false" :dismissable="true">
    <template #content>
        <aside class="w-65 h-full border-r dark:border-gray-600 border-gray-400 py-12 dark:bg-[#272b31] bg-neutral-300 lg:hidden">
            
            
            <img v-if="userData?.image" :src="JSON.parse(userData.image).url" alt="" class="rounded-full mx-auto w-37.5 h-37.5">
            <img v-else src="/defaults/defaultUser.webp" alt="" class="rounded-full mx-auto w-37.5 h-37.5">
            <nav class="flex flex-col mt-24 text-lg space-y-4 w-50 mx-auto">
                <button @click="scrollTo('home')"  class="navBtn cursor-pointer text-center">
                    <p>Home</p>
                    <div class="divider w-0 border-b"></div>
                </button>
                <button @click="scrollTo('projects')"  class="navBtn cursor-pointer text-center">
                    <p>Projetos</p>
                    <div class="divider w-0 border-b"></div>
                </button >
                <button @click="scrollTo('about')" class="navBtn cursor-pointer text-center">
                    <p>Sobre</p>
                    <div class="divider w-0 border-b"></div>
                </button>
                <button @click="scrollTo('contact')"  class="navBtn cursor-pointer text-center">
                    <p>Contato</p>
                    <div class="divider w-0 border-b"></div>
                </button>
            </nav>
        </aside>
    </template>
  </UDrawer>
</template>

<style scoped>
    aside{
        box-shadow: 0 0 10px rgba(106, 114, 130,.8) ;
    }

    aside img{
        filter: drop-shadow(0 0 10px rgba(106, 114, 130,.8));
    }

    .divider{
        transition: .2s;
    }

    .navBtn:hover .divider{
        width: 100%;
    }
</style>