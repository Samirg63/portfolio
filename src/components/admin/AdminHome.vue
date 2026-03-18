<script setup lang="ts">
    import { inject, onMounted, ref } from 'vue'
    import type { IUserData,IContactData, generateAlert, ErrorResponse } from '@/utils/interfaces'
    import { getContactData,editContactData } from '@/services/contactServices'
    import { getUserData,editUserData, getUserKeyData, editSecondaryPortrait, removeImage } from '@/services/userService'
    import { VueSpinner } from 'vue3-spinners'
import AdminHomePlaceholder from '../placeholders/AdminHomePlaceholder.vue'

    const generateAlert:generateAlert = inject('generateAlert')!
    

    const userData = ref<IUserData | null>(null)
    const contactData = ref<IContactData | null>(null)
    const userEdited = ref<boolean>(false);
    const contactEdited = ref<boolean>(false);
    const image = ref<File | null>(null);
    const uploadLoading = ref<boolean>(false)

    onMounted(async()=>{
        try {
            userData.value = await getUserData();
            contactData.value = await getContactData();
        } catch (error:unknown) {
            if((error as ErrorResponse)){
            console.log((error as ErrorResponse).response.data.error)
        }
        }
    })

    async function updateSecondaryPhoto(e:Event){
        const target = e.target as HTMLInputElement

        if(target.files && target.files.length > 0){
            uploadLoading.value = true;
            image.value = target.files[0]!

            const formData = new FormData();
            formData.append('file',image.value)
            try {
                await editSecondaryPortrait(formData,userData.value!.id)

                const newImage = (await getUserKeyData('secondImage') as {secondImage:string}).secondImage ;
                
                
                userData.value!.secondImage = newImage
                generateAlert(true, 'Foto alterada com sucesso!');
                
            } catch (error) {
                const response = (error as ErrorResponse).response.data.statusCode
                if(response == 'FILE_TOO_LARGE'){
                    generateAlert(false,'Arquivo é grande demais! tamanho maximo: 10,4MB')
                }else{
                    generateAlert(false, 'Erro ao alterar a foto de perfil');
                }
            }
            image.value = null;
            uploadLoading.value = false
        }else{
            image.value = null;
        }
    }


    async function update(e:Event){
        e.preventDefault()
        let ok:boolean = true;

        if(userEdited.value){
            try {
                await editUserData(userData.value as IUserData);
                
            } catch (error:unknown) {
                ok = false
                if((error as {response:{data:{error:string}}})){
                    
                    console.log((error as {response:{data:{error:string}}}).response.data.error)
                }
            }
        }

        if(contactEdited.value){
            try {
                await editContactData(contactData.value as IContactData);
                
            } catch (error:unknown) {
                ok = false;
                if((error as {response:{data:{error:string}}}))
                    console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
        }

        if(ok){
            generateAlert(true,'Editado com sucesso!')
        }else{
            generateAlert(false,'Algo deu errado')
        }
    }

    async function handleRemoveSecondImage(id:number,imageId:string,imageType:'primary'|'secondary',close:()=>void){
        try {
            if(await removeImage(id,imageId,imageType)){
                userData.value!.secondImage = '';
                generateAlert(true,'Removida com sucesso!')
                close();
            }
        } catch (error:unknown) {
            if(error as ErrorResponse){
                console.log((error as ErrorResponse).response.data.error)
            }
            generateAlert(false,'Erro ao remover!')
        }
    }

</script>

<template>
    <section>
        <form method="post" class="flex items center justify-around max-md:flex-col">
            <div class="mb-16 w-55 max-md:w-full text-center">
                <div class="rounded-full cursor-pointer w-55 h-55 relative max-md:mx-auto max-md:mb-6">
                    <template v-if="userData! && userData!.secondImage">
                        <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
                        <img v-else :src="JSON.parse(userData!.secondImage).url" alt="" class="rounded-[inherit] w-full h-full ">
                    </template>
                    <template v-else>
                        <VueSpinner v-if="uploadLoading" color="#e5e7eb" size="60" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-5"/>
                        <img v-else  src="/defaults/defaultUser.webp" alt="" class="rounded-[inherit] w-full h-full">
                    </template>
                    <label for="secPortrait" class="bg-zinc-800/60 cursor-pointer w-full h-full rounded-[inherit] absolute top-0 hover:opacity-100 opacity-0 duration-200 border-black flex justify-center items-center">
                        <div class="max-w-9/12 text-center">
                            <v-icon name="bi-images" scale="2.75"/>
                            <p>Mudar foto de perfil</p>
                        </div>
                    </label>
                    <UPopover mode="click" arrow :content="{align:'center',side:'right'}" :ui="{arrow:'fill-gray-200 '}">
                        <button class="cursor-pointer absolute -top-4 -right-4 bg-gray-200 w-6 h-6 rounded-full opacity-40 hover:opacity-100 duration-200">
                            <v-icon name="bi-trash-fill" class="fill-zinc-700"/>
                        </button>
                        <template #content="{close}">
                            <div class="p-4 border dark:border-gray-200 border-zinc-700 rounded-md dark:bg-zinc-800 bg-gray-200">
                                <h6 class="font-semibold text-md text-center mb-2 leading-5">Tem certeza que deseja remover a imagem?
                                    
                                </h6>
                                <div class="flex items-center gap-4 justify-center">
                                    <button @click="(()=>{close()})" class="font-semibold dark:bg-gray-200 bg-zinc-700 duration-200 dark:hover:bg-gray-300 hover:bg-zinc-800 rounded-sm cursor-pointer dark:text-zinc-700 text-gray-200 py-1 px-2 w-1/2">Cancelar</button>
                                    <button @click="handleRemoveSecondImage(userData!.id,JSON.parse(userData?.secondImage!).id,'secondary',close)" class="font-semibold text-gray-200 bg-red-600 duration-200 hover:bg-red-800 rounded-sm cursor-pointer py-1 px-2 w-1/2">Apagar</button>
                                </div>
                            </div>
                        </template>
                    </UPopover>
                    <form action="">
                        <input type="file"  @change="updateSecondaryPhoto($event)" name="portrait" accept="image/*" id="secPortrait" hidden>
                    </form>
            </div>
                <small class="cursor-default ">*Se uma foto não for selecionada, será utilizada a mesma foto do perfil</small>
            </div>

            <div v-if="userData && contactData" class="w-6/12 max-md:w-full space-y-4" >
                <div>
                    <label for="" class="font-semibold">Nome:</label>
                    <input @change="()=>{userEdited = true}" placeholder="Nome..." type="text" name="name" v-model="userData!.name"  class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
                </div>
                <div>
                    <label for="" class="font-semibold">Sub-título:</label>
                    <input @change="()=>{userEdited = true}" placeholder="Sub-título..." type="text" name="subtitle" v-model="userData!.subtitle" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
                </div>
                <div>
                    <label for="" class="font-semibold">Links:</label>
                    <div class="flex gap-4">
                        <input @change="()=>{contactEdited = true}" placeholder="Github..." type="text" name="gitHub" v-model="contactData!.github" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-1/2 h-10 border pl-2 rounded-lg">
                        <input @change="()=>{contactEdited = true}" placeholder="LinkedIn" type="text" name="linkedIn" v-model="contactData!.linkedIn" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-1/2 h-10 border pl-2 rounded-lg">
                    </div>
                </div>
                <input @click="update($event)" type="submit" value="Editar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold max-md:mx-auto max-md:block max-md:w-1/2">
            </div>
            <AdminHomePlaceholder v-else/>
        </form>
    </section>
</template>