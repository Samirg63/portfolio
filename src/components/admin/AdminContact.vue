<script setup lang="ts">
    import { computed, inject, onMounted } from 'vue'
    import type { ErrorResponse, generateAlert, IContactData } from '@/utils/interfaces'
    import {vMaska} from 'maska/vue'
    import AdminContactPlaceholder from '../placeholders/AdminContactPlaceholder.vue'
    import { useContactData } from '@/composables/ContactComposable'

    const {contactData,loadContact,saveContact} = useContactData();
    const generateAlert:generateAlert = inject('generateAlert')!

    onMounted(async()=>{
        try {
            await loadContact();     
        } catch (error:unknown) {
            if((error as {response:{data:{error:string}}})){
            console.log((error as {response:{data:{error:string}}}).response.data.error)
        }
        }
    })

    const maskOptions = computed(()=>{
        if(contactData.value!.whatsapp){
            if(contactData.value!.whatsapp.length < 14){
                return '(##)####-#####'
            }else{
                return '(##)#####-####'
            }
        }else{
            return '(##)####-####'
        }
    })

    async function handleEdit(e:Event){
        e.preventDefault();

        try {
            await saveContact(contactData.value as IContactData);  
            generateAlert(true, "Conteúdo editado com sucesso!")
            
        } catch (error:unknown) {
            if((error as ErrorResponse)){
                if((error as ErrorResponse).response.data.statusCode == "MISSING_PARAMS"){
                    generateAlert(false,"Todos os campos obrigatórios devem ser preenchidos")
                }else{
                    generateAlert(false,'Algo deu errado')
                    console.log((error as ErrorResponse).response.data.error)
                }
            }
        }
    }
    
</script>

<template>
    <form v-if="contactData" method="post" class="w-8/12 max-md:w-full md:min-w-225 mx-auto space-y-4">
        <div>
            <label for="" class="font-semibold">*Título:</label>
            <input placeholder="Título..." type="text" name="CallPhrase" v-model="contactData!.sectionTitle" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
        </div>
        <div>
            <label for="" class="font-semibold">*Sub-título:</label>
            <input placeholder="Sub-título..." type="text" name="SubCallPhrase" v-model="contactData!.sectionSubtitle " class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
        </div>
        
        <div class="grid grid-cols-2 grid-rows-2 gap-4">
            <div>
                <label for="" class="font-semibold">Github:</label>
                <input placeholder="Github..." type="text" name="github" v-model="contactData!.github" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
            </div>
            <div>
                <label for="" class="font-semibold">LinkedIn:</label>
                <input placeholder="LinkedIn..." type="text" name="linkedIn" v-model="contactData!.linkedIn" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
            </div>
            <div>
                <label for="" class="font-semibold">*E-mail:</label>
                <input placeholder="E-mail..." type="text" name="email" v-model="contactData!.email" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
            </div>
            <div>
                <label for="" class="font-semibold">*Whatsapp:</label>
                <input placeholder="Whatsapp..." v-maska="maskOptions" type="text"  name="whatsapp"  v-model="contactData!.whatsapp" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg"/>
            </div>
        </div>
        <input @click="handleEdit" type="submit" value="Editar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold max-md:ml-auto max-md:block max-md:w-45">
    </form>
    <AdminContactPlaceholder v-else />
</template>