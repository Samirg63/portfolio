<script setup lang="ts">
import { onMounted, ref } from 'vue'
    import type { IContactData } from '@/utils/interfaces'
    import { getContactData } from '@/services/contactServices'

    const contactData = ref<IContactData | null>(null)

    onMounted(async()=>{
            try {
                contactData.value = await getContactData();
            } catch (error:unknown) {
                if((error as {response:{data:{error:string}}})){
                console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
            }
        })
</script>

<template>
    <form method="post" class="w-8/12 min-w-225 mx-auto space-y-4">
        <div>
            <label for="" class="font-semibold">Título:</label>
            <input placeholder="Título..." type="text" name="CallPhrase" :value="contactData?.sectionTitle" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
        </div>
        <div>
            <label for="" class="font-semibold">Sub-título:</label>
            <input placeholder="Sub-título..." type="text" name="SubCallPhrase" :value="contactData?.sectionSubtitle" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
        </div>
        
        <div class="grid grid-cols-2 grid-rows-2 gap-4">
            <div>
                <label for="" class="font-semibold">Github:</label>
                <input placeholder="Github..." type="text" name="github" :value="contactData?.github" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
            </div>
            <div>
                <label for="" class="font-semibold">LinkedIn:</label>
                <input placeholder="LinkedIn..." type="text" name="linkedIn" :value="contactData?.linkedIn" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
            </div>
            <div>
                <label for="" class="font-semibold">E-mail:</label>
                <input placeholder="E-mail..." type="text" name="email" :value="contactData?.email" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
            </div>
            <div>
                <label for="" class="font-semibold">Whatsapp:</label>
                <input placeholder="Whatsapp..." type="text" name="whatsapp" :value="contactData?.whatsapp" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
            </div>
        </div>
        <input type="submit" value="Editar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold">
    </form>
</template>