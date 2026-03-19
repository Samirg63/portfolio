<script setup lang="ts">

import { onMounted } from 'vue';
import { formatLink } from '@/utils/helpers';
import ContactPlaceholder from './placeholders/ContactPlaceholder.vue';
import { useContactData } from '@/composables/ContactComposable';

    
    const {contactData,loading,loadContact} = useContactData();


    onMounted(async()=>{
        try {
            await loadContact();
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
            console.log((error as {response:{data:{error:string}}}).response.data.error)
        }
        }
    })

   

</script>

<template>
    <section class="p-12" v-if="!loading">
        <div class="text-center">
            <h2 class="font-semibold text-3xl ">{{ contactData?.sectionTitle }}</h2>
            <p class="dark:text-gray-400 text-zinc-600">{{ contactData?.sectionSubtitle }}</p>
        </div>
        <div class="my-6 flex gap-4 justify-between min-w-8/12 max-w-11/12 mx-auto flex-wrap">
            <a class="max-lg:w-[45%] w-45 block dark:bg-zinc-900 bg-gray-100 border-fuchsia-700 text-fuchsia-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" v-if="contactData?.github" :href="formatLink(contactData?.github)"><v-icon name="bi-github"/>  Github</a>
            <a class="max-lg:w-[45%] w-45 block dark:bg-zinc-900 bg-gray-100 border-blue-700 text-blue-700 border px-2 py-1 rounded-sm cursor-pointer" target="_blank" v-if="contactData?.linkedIn" :href="formatLink(contactData?.linkedIn)"><v-icon name="bi-linkedin"/> LinkedIn</a>
            <a class="max-lg:w-[45%] w-45 block dark:bg-zinc-900 bg-gray-100 border-rose-600 text-rose-600 border px-2 py-1 rounded-sm " v-if="contactData?.email" ><v-icon name="md-email-round"/><span class="ml-2">{{contactData?.email}}</span></a>
            <button class="max-lg:w-[45%] w-45 block dark:bg-zinc-900 bg-gray-100 border-green-500 text-green-500 border px-2 py-1 rounded-sm " v-if="contactData?.whatsapp" ><v-icon name="bi-whatsapp"/> {{contactData?.whatsapp}}</button>
        </div>
    </section>
    <contact-placeholder v-else/>
</template>