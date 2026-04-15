<script setup lang="ts">
    import { inject, onMounted, ref } from 'vue'
    import type { generateAlert, IUserData} from '@/utils/interfaces'
    import {  confirmPassword } from '@/services/authServices';
    import AdminAccountPlaceholder from '../placeholders/AdminAccountPlaceholder.vue';
import { useUserData } from '@/composables/UserComposable';


    const {loadUser,userData,loading,saveUser} = useUserData();
    
    
    const confirmModal = ref<boolean>(false);
    const changePasswordModal = ref<boolean>(false);
    const passwordVisibility = ref<boolean>(false);
    const password = ref<string>('')
    const passwordConfirm = ref<string>('')
    const generateAlert:generateAlert = inject('generateAlert')!
    const logout:()=>void = inject('logout')!;

    onMounted(async()=>{
            try {
                await loadUser();               
            } catch (error:unknown) {
                if((error as {response:{data:{error:string}}})){
                console.log((error as {response:{data:{error:string}}}).response.data.error)
            }
            }
    })

    function handlePasswordVisibility(e:Event){
        e.preventDefault()
        passwordVisibility.value = !passwordVisibility.value
    }

    async function confirmPass(){
        if(password.value == ''){
            generateAlert(false,"Insira a senha!")
        }

        if(await confirmPassword(password.value)){
            password.value = ''
            changePasswordModal.value = true
            confirmModal.value = false;
        }else{
            password.value = '';
            generateAlert(false,"Senha Incorreta!")
        }
    }

    async function handleChangePassword(){
        if(password.value === passwordConfirm.value){
            try {
                
                await saveUser({password:password.value} as IUserData)
                generateAlert(true, "Senha redefinida com sucesso! redirecionando...")
                setTimeout(() => {
                    logout()
                }, 3000);
            } catch {
                generateAlert(false,"Erro ao redefinir a senha!")
            }

            
        }else{
            generateAlert(false,"As senhas não coincidem")
        }

    }

    async function handleChangeEmail(e:Event){
        e.preventDefault()

        try {
            
                await saveUser({email:userData.value?.email,id:userData.value?.id} as IUserData)
                generateAlert(true, "Email redefinido com sucesso! redirecionando...")
                setTimeout(() => {
                    logout()
                }, 3000);
            } catch {
                generateAlert(false,"Erro ao redefinir a E-mail!")
            }
    }
</script>

<template>
    <form v-if="!loading" method="post" class="w-8/12 max-md:w-full md:min-w-225 mx-auto space-y-4">
        <div>
            <small>*Ao redefinir o E-mail, você será automaticamente deslogado!</small><br>
            <label for="" class="font-semibold">E-mail:</label>
            <input v-if="userData" placeholder="E-mail..." type="text" name="email" v-model="userData!.email" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
        </div>
        <div class="space-x-4 max-md:flex">
            <button @click="(e)=>{e.preventDefault();confirmModal = true}" class="bg-gray-200 hover:bg-gray-300 duration-200 text-zinc-800 py-2  rounded-lg cursor-pointer font-semibold w-40 max-md:w-1/2">Alterar a senha</button>
            <button :disabled="loading" @click="handleChangeEmail($event)" type="submit"  class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2  rounded-lg cursor-pointer font-semibold w-40 max-md:w-1/2">
                <vue-spinner-dots v-if="loading" size="24" class="mx-auto"/>
                <h1 v-else>Editar</h1>
            </button>
        </div>
    </form>
    <AdminAccountPlaceholder v-else />

    <UModal v-model:open="confirmModal" class="p-4 text-zinc-700 dark:text-gray-200 dark:bg-zinc-800">
        <template #content>
            <div>
                <h5 class="">Confirme a sua senha atual:</h5>
                <div class="relative flex items-center">
                    <input v-model="password" :type="(passwordVisibility)?'text':'password'" name="password" id="password" placeholder="Senha..." class="border rounded-md bg-gray-300  py-2 px-4 w-full dark:text-zinc-800 border-gray-300 dark:border-zinc-700">
                    <button @click="handlePasswordVisibility($event)" class="absolute right-2 pt-1 cursor-pointer"><v-icon scale="1.1" :name="(passwordVisibility)?'bi-eye-slash':'bi-eye'" class="fill-zinc-700"/></button>
                </div>
                <div class="flex items-center gap-2 mt-4">
                    <button @click="()=>{confirmModal=false;password = '';}" class="py-1 max-md:py-2 px-2 w-1/2 cursor-pointer rounded-md duration-200 bg-gray-200 text-zinc-700 hover:bg-gray-300">Cancelar</button>
                    <button @click="confirmPass" class="py-1 max-md:py-2 px-2 w-1/2 cursor-pointer rounded-md duration-200 bg-fuchsia-700 hover:bg-fuchsia-800 text-gray-200">Confirmar</button>
                </div>
            </div>
        </template>
    </UModal>

    <UModal v-model:open="changePasswordModal" :overlay="false" class="p-4 text-zinc-700 dark:text-gray-200 dark:bg-zinc-800">
        <template #content>
            <div class="space-y-2">  
                <small>*Ao alterar a senha você será automaticamente deslogado</small>
                <div>
                    <label for="">Nova senha:</label>
                    <div class="relative flex items-center ">
                        <input v-model="password" :type="(passwordVisibility)?'text':'password'" name="password" id="password" placeholder="Senha..." class="border rounded-md bg-gray-300   py-2 px-4 w-full dark:text-zinc-800 border-gray-300 dark:border-zinc-700">
                        <button @click="handlePasswordVisibility($event)" class="absolute right-2 pt-1 cursor-pointer"><v-icon scale="1.1" :name="(passwordVisibility)?'bi-eye-slash':'bi-eye'" class="fill-zinc-700"/></button>
                    </div>
                </div>
                <div>
                    <label for="">Confirme a senha:</label>
                    <div class="relative flex items-center ">
                        <input v-model="passwordConfirm" :type="(passwordVisibility)?'text':'password'" name="password" id="password" placeholder="Senha..." class="border rounded-md bg-gray-300   py-2 px-4 w-full dark:text-zinc-800 border-gray-300 dark:border-zinc-700">
                        <button @click="handlePasswordVisibility($event)" class="absolute right-2 pt-1 cursor-pointer"><v-icon scale="1.1" :name="(passwordVisibility)?'bi-eye-slash':'bi-eye'" class="fill-zinc-700"/></button>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-4">
                    <button @click="()=>{changePasswordModal=false;password='',passwordConfirm=''}" class="py-1 max-md:py-2 px-2 w-1/2 cursor-pointer rounded-md duration-200 bg-gray-200 text-zinc-700 hover:bg-gray-300">Cancelar</button>
                    <button :disabled="loading" @click="handleChangePassword" class="py-1 max-md:py-2 px-2 w-1/2 cursor-pointer rounded-md duration-200 text-gray-200 bg-fuchsia-700 hover:bg-fuchsia-800">
                        <vue-spinner-dots v-if="loading" size="24" class="mx-auto"/>
                            <h1 v-else>Confirmar</h1>
                    </button>
                </div>
            </div>
        </template>
    </UModal>
</template>