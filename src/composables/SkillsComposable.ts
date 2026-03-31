import { editSkillGroup, getSkillsGroupsData } from "@/services/skillsGroupServices";
import { editSkill } from "@/services/skillsServices";
import type { ISkillsData, ISkillsGroupData } from "@/utils/interfaces";
import { ref } from "vue";

const cache_key:string = 'skillsGroupData';
const enableCache = import.meta.env.VITE_ENABLE_CACHE === 'true';

export function useSkillsData(){
    const loading = ref<boolean>(false);
    const skillsGroupData = ref<ISkillsGroupData[]>([])

    async function loadSkills(){
        loading.value = true;
        const cache = sessionStorage.getItem(cache_key);
        if(cache && enableCache){
            skillsGroupData.value = JSON.parse(cache)
            loading.value = false;
            return;
        }

        try{
            const data = await getSkillsGroupsData();
            skillsGroupData.value = data;
            sessionStorage.setItem(cache_key,JSON.stringify(data));
        } finally{
            loading.value = false;
        }
    }

    async function saveSkillGroup(newData:ISkillsGroupData) {
        loading.value = true
    
        try {
            await editSkillGroup(newData)
            clearCache();
            
    
        }catch(e:unknown){
            throw e;
        }
         finally {
          loading.value = false
        }
    }

    async function saveSkill(newData:ISkillsData) {
        loading.value = true
    
        try {
            await editSkill(newData)
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
        skillsGroupData,
        loading,
        loadSkills,
        saveSkillGroup,
        saveSkill,
        clearCache
    }
}