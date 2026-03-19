import { editProject, getProjectsData } from "@/services/projectsServices";
import type { IModalData, IProjectsData } from "@/utils/interfaces";
import { ref } from "vue";

const cache_key:string = 'projectsData';

export function useProjectsData(){
    const loading = ref<boolean>(false);
    const projectsData = ref<IProjectsData[]>([])

    async function loadProjects(){
        loading.value = true;
        const cache = sessionStorage.getItem(cache_key);
        if(cache){
            projectsData.value = JSON.parse(cache)
            loading.value = false;
            return;
        }

        try{
            const data = await getProjectsData();
            projectsData.value = data;
            sessionStorage.setItem(cache_key,JSON.stringify(data));
        }catch(e:unknown){
            throw e;
        }
         finally{
            loading.value = false;
        }
    }

    async function saveProject(newData:IModalData) {
    loading.value = true

    try {
        await editProject(newData)
        clearCache();
        await loadProjects();

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
        projectsData,
        loading,
        loadProjects,
        saveProject,
        clearCache
    }
}