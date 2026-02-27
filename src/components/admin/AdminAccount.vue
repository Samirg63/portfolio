<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import type { IUserData} from '@/utils/interfaces'
    import { getUserData } from '@/services/userService'

    const userData = ref<IUserData | null>(null)

    onMounted(async()=>{
            try {
                userData.value = await getUserData();
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
            <label for="" class="font-semibold">E-mail:</label>
            <input placeholder="E-mail..." type="text" name="email" :value="userData?.email" class="bg-gray-200 border-zinc-900 text-zinc-800 placeholder:text-zinc-800 w-full h-10 border pl-2 rounded-lg">
        </div>
        <div class="space-x-4">
            <button class="bg-gray-200 hover:bg-gray-300 duration-200 text-zinc-800 py-2  rounded-lg cursor-pointer font-semibold w-40">Alterar a senha</button>
            <input type="submit" value="Editar" class="bg-fuchsia-700 hover:bg-fuchsia-600 duration-200 text-gray-200 py-2  rounded-lg cursor-pointer font-semibold w-40">
        </div>
    </form>
</template>