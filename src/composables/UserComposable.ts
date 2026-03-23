import { editUserData, getUserData } from "@/services/userService";
import type { IUserData } from "@/utils/interfaces";
import { ref } from "vue";

const cache_key:string = 'userData';
const enableCache = import.meta.env.VITE_ENABLE_CACHE === 'true';

export function useUserData(){
    const loading = ref<boolean>(false);
    const userData = ref<null|IUserData>(null)

    async function loadUser(){
        loading.value = true;
        const cache = sessionStorage.getItem(cache_key);
        if(cache && enableCache){
            const {password,...rest} =  JSON.parse(cache)
            userData.value = rest;
            loading.value = false;
            return;
        }

        try{
            const data = await getUserData();
            const {password,...rest} =  data
            userData.value = rest as IUserData;
            sessionStorage.setItem(cache_key,JSON.stringify(rest))
        }catch(e:unknown){
            throw e;
        } finally{
            loading.value = false;
        }
    }

    async function saveUser(newData:IUserData){
        try {
            loading.value = true;
            await editUserData(newData)
            userData.value = newData;
            clearCache();
        } finally{
            loading.value = false;
        }
    }

    function clearCache(){
        sessionStorage.removeItem(cache_key)
    }

    return{
        userData,
        loading,
        loadUser,
        saveUser,
        clearCache
    }
}