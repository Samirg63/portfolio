import { editHardskillGroup, getHardskillsGroupsData } from "@/services/hardskillsGroupsServices";
import { editHardskill } from "@/services/hardskillsServices";
import type { IHardskillsData, IHardskillsGroupsData } from "@/utils/interfaces";
import { ref } from "vue";

const cache_key:string = 'hardskillsGroupData';

export function useSkillsData(){
    const loading = ref<boolean>(false);
    const hardskillsGroupData = ref<IHardskillsGroupsData[]>([])

    async function loadSkills(){
        loading.value = true;
        const cache = sessionStorage.getItem(cache_key);
        if(cache){
            hardskillsGroupData.value = JSON.parse(cache)
            loading.value = false;
            return;
        }

        try{
            const data = await getHardskillsGroupsData();
            hardskillsGroupData.value = data;
            sessionStorage.setItem(cache_key,JSON.stringify(data));
        } finally{
            loading.value = false;
        }
    }

    async function saveSkillGroup(newData:IHardskillsGroupsData) {
        loading.value = true
    
        try {
            await editHardskillGroup(newData)
            clearCache();
            await loadSkills();
    
        }catch(e:unknown){
            throw e;
        }
         finally {
          loading.value = false
        }
    }

    async function saveSkill(newData:IHardskillsData) {
        loading.value = true
    
        try {
            await editHardskill(newData)
            clearCache();
            await loadSkills();
    
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
        hardskillsGroupData,
        loading,
        loadSkills,
        saveSkillGroup,
        saveSkill,
        clearCache
    }
}