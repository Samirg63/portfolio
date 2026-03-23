import { editContactData, getContactData } from "@/services/contactServices";
import type { IContactData } from "@/utils/interfaces";
import { ref } from "vue";

const cache_key:string = 'contactData';
const enableCache = import.meta.env.VITE_ENABLE_CACHE === 'true';

export function useContactData(){
    const loading = ref<boolean>(false);
    const contactData = ref<null|IContactData>(null)

    async function loadContact(){
        loading.value = true;

        const cache = sessionStorage.getItem(cache_key);
        if(cache && enableCache){
            contactData.value = JSON.parse(cache)
            loading.value = false;
            return;
        }

        try{
            const data = await getContactData();
            contactData.value = data;
            sessionStorage.setItem(cache_key,JSON.stringify(data));
        }catch(e:unknown){
            throw e;
        } finally{
            loading.value = false;
        }
    }

    async function saveContact(newData:IContactData){
        try {
            loading.value = true;
            await editContactData(newData)
            clearCache()
        
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
        contactData,
        loading,
        loadContact,
        saveContact,
        clearCache
    }
}