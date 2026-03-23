import { editAboutData, getAboutData } from "@/services/aboutServices";
import type { IAboutData } from "@/utils/interfaces";
import { ref } from "vue";

const cache_key:string = 'aboutData';
const enableCache = import.meta.env.VITE_ENABLE_CACHE === 'true';

export function useAboutData(){
    const loading = ref<boolean>(false);
    const aboutData = ref<null|IAboutData>(null)

    async function loadAbout(){
        loading.value = true;
        const cache = sessionStorage.getItem(cache_key);
        if(cache && enableCache){
            aboutData.value = JSON.parse(cache)
            loading.value = false;
            return;
        }

        try{
            const data = await getAboutData();
            aboutData.value = data;
            sessionStorage.setItem(cache_key,JSON.stringify(data));
        }catch(e:unknown){
            throw e;
        } finally{
            loading.value = false;
        }
    }

    async function saveAbout(newData:IAboutData){
        try {
            loading.value = true;
            await editAboutData(newData)
            aboutData.value = newData;
            sessionStorage.setItem(cache_key,JSON.stringify(newData))
        }catch(e:unknown){
            throw e;
        } finally{
            loading.value = false;
        }
    }

    function clearCache(){
        sessionStorage.removeItem(cache_key)
    }

    return{
        aboutData,
        loading,
        loadAbout,
        saveAbout,
        clearCache
    }
}