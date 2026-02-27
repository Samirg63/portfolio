<script setup lang="ts">
    import { inject, onMounted, ref } from 'vue'
    import type { IUserData,IContactData, generateAlert, ErrorResponse } from '@/utils/interfaces'
    import { getContactData,editContactData } from '@/services/contactServices'
    import { getUserData,editUserData, getUserKeyData, editSecondaryPortrait } from '@/services/userService'

    const generateAlert:generateAlert = inject('generateAlert')!
    

    const userData = ref<IUserData | null>(null)
    const contactData = ref<IContactData | null>(null)
    const userEdited = ref<boolean>(false);
    const contactEdited = ref<boolean>(false);
    const image = ref<File | null>(null);

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
            image.value = target.files[0]!

            const formData = new FormData();
            formData.append('file',image.value)
            try {
                await editSecondaryPortrait(formData,userData.value!.id)

                const newImage = (await getUserKeyData('secondImage') as {secondImage:string}).secondImage ;
                
                
                userData.value!.secondImage = newImage
                generateAlert(true, 'Foto alterada com sucesso!');
                
            } catch (error) {
                console.log(error)
                generateAlert(false, 'Erro ao alterar a foto');
            }
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

</script>

<template>
    <section>
        <form method="post" class="flex items center justify-around">
            <div class="mb-16 w-55 text-center">
                <div class="rounded-full cursor-pointer w-55 h-55 relative ">
                    <template v-if="userData! && userData!.secondImage">
                        <img :src="JSON.parse(userData!.secondImage).url" alt="" class="rounded-[inherit] w-full h-full">
                    </template>
                    <img v-else src="/defaults/defaultUser.webp" alt="" class="rounded-[inherit] w-full h-full">
                    <label for="secPortrait" class="bg-zinc-800/60 cursor-pointer w-full h-full rounded-[inherit] absolute top-0 hover:opacity-100 opacity-0 duration-200 border-black flex justify-center items-center">
                        <div class="max-w-9/12 text-center">
                            <v-icon name="bi-images" scale="2.75"/>
                            <p>Mudar foto de perfil</p>
                        </div>
                    </label>
                    <form action="">
                        <input type="file"  @change="updateSecondaryPhoto($event)" name="portrait" accept="image/*" id="secPortrait" hidden>
                    </form>
            </div>
                <small class="cursor-default">*Se uma foto não for selecionada, será utilizada a mesma foto do perfil</small>
            </div>

            <div class="w-6/12 space-y-4" v-if="userData && contactData">
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
                <input @click="update($event)" type="submit" value="Editar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2 px-10 rounded-lg cursor-pointer font-semibold">
            </div>
        </form>
    </section>
</template>