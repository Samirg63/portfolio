<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import router from '@/router';
import { destroyTokens, editUser, verifyToken } from '@/services/authServices';
import type { ErrorResponse, generateAlert } from '@/utils/interfaces';
import { useRoute } from 'vue-router';

    const generateAlert:generateAlert = inject('generateAlert')!
    
    const params = ref<{token:string,id:string}>({} as {token:string,id:string})
    const password = ref<string>('')
    const passwordConfirm = ref<string>('')
    const passwordVisibility = ref<boolean>(false)
    const route = useRoute();

    onMounted(()=>{
        params.value = {token:route.query.token as string,
            id:route.query.id as string
        }
        if(!params.value.token || ! params.value.id){
            router.push('/admin/auth')
        }
    })


    function handlePasswordVisibility(e:Event){
        e.preventDefault()
        passwordVisibility.value = !passwordVisibility.value
    }

    async function handleChangePassword(){
        if(password.value == ''){
            generateAlert(false,"Insira uma senha válida")
            return;
        }
        
        if(password.value === passwordConfirm.value){
            try {
                if(await verifyToken(params.value)){
                    await editUser({password:password.value})
                    await destroyTokens();
                    generateAlert(true, "Senha redefinida com sucesso! redirecionando...")

                    setTimeout(() => {
                        
                        router.push('/admin/auth')
                    }, 3000);
                }
            } catch(e:unknown) {
                if((e as ErrorResponse).response.data.statusCode == 'EXPIRED_TOKEN'){
                    generateAlert(false,"O token expirou!")
                }else if((e as ErrorResponse).response.data.statusCode == 'INVALID_TOKEN'){
                    generateAlert(false,"Token Inválido!")
                }else{
                    generateAlert(false,"Erro ao redefinir a senha!")
                }
            }

            
        }else{
            generateAlert(false,"As senhas não coincidem")
        }

    }
</script>

<template>
    <div class="p-4 border rounded-lg inline-block absolute top-1/2 left-1/2 -translate-1/2 dark:bg-zinc-800 bg-gray-200 text-zinc-700 dark:text-gray-200 min-w-130">
        <h3 class="font-semibold mb-4 text-xl">Redefina a sua senha:</h3>
        <div>
            <label for="" class="font-semibold">Nova senha:</label>
            <div class="relative flex items-center ">
                <input v-model="password" :type="(passwordVisibility)?'text':'password'" name="password" id="password" placeholder="Senha..." class="border rounded-md bg-gray-300 dark:bg-zinc-700 text-zinc-800 dark:text-gray-200 border-gray-300 dark:border-zinc-700 dark:placeholder:text-gray-200/80 placeholder:text-zinc-700/80  py-2 px-4 w-full ">
                <button @click="handlePasswordVisibility($event)" class="absolute right-2 pt-1 cursor-pointer"><v-icon scale="1.1" :name="(passwordVisibility)?'bi-eye-slash':'bi-eye'" class="fill-zinc-700 dark:fill-gray-200"/></button>
            </div>
        </div>
        <div>
            <label for="" class="font-semibold">Confirme a senha:</label>
            <div class="relative flex items-center ">
                <input v-model="passwordConfirm" :type="(passwordVisibility)?'text':'password'" name="password" id="password" placeholder="Senha..." class="border rounded-md bg-gray-300 dark:bg-zinc-700 text-zinc-800 dark:text-gray-200 border-gray-300 dark:border-zinc-700 dark:placeholder:text-gray-200/80 placeholder:text-zinc-700/80  py-2 px-4 w-full ">
                <button @click="handlePasswordVisibility($event)" class="absolute right-2 pt-1 cursor-pointer"><v-icon scale="1.1" :name="(passwordVisibility)?'bi-eye-slash':'bi-eye'" class="fill-zinc-700 dark:fill-gray-200"/></button>
            </div>
        </div>
        <div class="flex items-center gap-2 mt-4">
            <button @click="()=>{router.push('/admin/auth')}" class="py-1 px-2 w-1/2 cursor-pointer rounded-md duration-200 dark:bg-gray-200 bg-zinc-700 dark:hover:bg-gray-300 hover:bg-zinc-800 dark:text-zinc-700 text-gray-200">Cancelar</button>
            <button @click="handleChangePassword" class="py-1 px-2 w-1/2 cursor-pointer rounded-md duration-200 bg-fuchsia-700 hover:bg-fuchsia-800 text-gray-200">Confirmar</button>
        </div>
    </div>
</template>