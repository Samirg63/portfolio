import { editTagGroup, getTagsGroupsData } from "@/services/tagsGroupsServices";
import { editTag } from "@/services/tagsServices";
import type { ITagsData, ITagsGroupsData } from "@/utils/interfaces";
import { ref } from "vue";

const cache_key:string = 'tagsData';
const enableCache = import.meta.env.VITE_ENABLE_CACHE === 'true';

export function useTagsData(){
    const loading = ref<boolean>(false);
    const tagsData = ref<null|ITagsGroupsData[]>(null)

    async function loadTags(){
        loading.value = true;
        const cache = sessionStorage.getItem(cache_key);
        if(cache && enableCache){
            tagsData.value = JSON.parse(cache)
            loading.value = false;
            return;
        }

        try{
            const data = await getTagsGroupsData();
            tagsData.value = data;
            sessionStorage.setItem(cache_key,JSON.stringify(data));
        } finally{
            loading.value = false;
        }
    }

    async function saveTagGroup(newData:ITagsGroupsData) {
        loading.value = true
    
        try {
            await editTagGroup(newData)
            clearCache();
    
        }catch(e:unknown){
            throw e;
        }
         finally {
          loading.value = false
        }
    }

    async function saveTag(newData:ITagsData) {
        loading.value = true
    
        try {
            await editTag(newData)
            clearCache();
        }catch(e:unknown){
            throw e;
        }
         finally {
          loading.value = false
        }
    }

    function clearCache(){
        sessionStorage.removeItem(cache_key)
    }

    return{
        tagsData,
        loading,
        loadTags,
        saveTagGroup,
        saveTag,
        clearCache
    }
}