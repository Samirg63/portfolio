<script setup lang="ts">

import { formatLink } from '@/utils/helpers';
import type { ErrorResponse} from '@/utils/interfaces';
import { onMounted } from 'vue';
import HomePlaceholder from './placeholders/HomePlaceholder.vue';
import { useUserData } from '@/composables/UserComposable';
import { useContactData } from '@/composables/ContactComposable';


const {loadUser,loading:userLoading, userData} = useUserData()
const {loadContact,loading:contactLoading, contactData} = useContactData()



    onMounted(async()=>{
            try {
  
                await Promise.all([loadUser(),loadContact()])
            } catch (error:unknown) {
                if((error as ErrorResponse)){
                console.log((error as ErrorResponse).response.data.error)
            }
            }
    })
</script>

<template>
    <section class="flex items-center space-x-8 p-12 max-md:flex-col max-md:text-center max-md:gap-4">
        <img v-if="userData?.secondImage" :src="JSON.parse(userData.secondImage).url" alt="" class="rounded-full w-75 h-75 max-md:mx-auto ">
        <img v-else-if="userData?.image" :src="JSON.parse(userData.image).url" alt="" class="rounded-full w-75 h-75 max-md:mx-auto ">
        <img v-else src="/defaults/defaultUser.webp" alt="" class="rounded-full w-75 h-75">
        <div class="space-y-4" v-if="!contactLoading && !userLoading">
            
                <h1 class="text-6xl">{{ userData?.name }}</h1>
                
            
            <div class="md:ml-10 md:-mr-10 text-box">
                <p class="font-light">{{ userData?.subtitle }}</p>
                <div class="flex items-center gap-4 mt-4 w-65 max-md:mx-auto">
                    <a v-if="contactData?.github" class="block w-1/2 dark:bg-zinc-900 bg-gray-100 border-fuchsia-700 text-fuchsia-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" :href="formatLink(contactData.github)"><v-icon name="bi-github"/>  Github</a>
                    <a v-if="contactData?.linkedIn" class="block w-1/2 dark:bg-zinc-900 bg-gray-100 border-blue-700 text-blue-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" :href="formatLink(contactData.linkedIn)"><v-icon name="bi-linkedin"/> LinkedIn</a>
                </div>
            </div>
        </div>
        <home-placeholder v-else/>
    </section>
</template>

<style scoped>
    img{
        filter: drop-shadow(0 0 10px rgba(106, 114, 130,.8));
    }

</style>