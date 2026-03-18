import type { IHttpResponse, IHardskillsGroupsData } from "@/utils/interfaces";
import axios from "axios";


const url:string = import.meta.env.VITE_API_URL+'/hardskillsGroups'

export async function getHardskillsGroupsData():Promise<IHardskillsGroupsData[]>{
    const data:IHttpResponse = await axios.get(url);
          
    if(data.data.status == 200){
        const arr:IHardskillsGroupsData[] = data.data.body as IHardskillsGroupsData[]
        return arr;
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function createHardskillsGroups(groupData:{name:string}){
    const data:IHttpResponse = await axios.post(url,JSON.stringify(groupData),{
        headers:{'Content-Type':'application/json'}
    });
    if(data.data.status == 200){
        return data.data;
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function editHardskillGroup(data:IHardskillsGroupsData){
    const edit = await axios.put(url+`/${data.id}`,JSON.stringify(data),{
        headers:{
            'Content-Type':'application/json'
        }
    });
    if(edit.data.status == 200){
        return edit.data;
    }else{
        if(typeof edit.data.error == 'string'){
            throw new Error(edit.data.error)
        }else{
            throw edit.data.error
        }
    }
}

export async function deleteHardskillGroup(id:number){
    const deleteGroup = await axios.delete(url+`/${id}`);
    if(deleteGroup.status == 200){
        return {group:deleteGroup.data};
    }else{
        if(typeof deleteGroup.data.error == 'string'){
            throw new Error(deleteGroup.data.error)
        }else{
            throw deleteGroup.data.error
        }
    }
}

export async function deleteSkillsOnGroup(groupId:number){
    const deleteSkill = await axios.delete(url+`/allGroup/${groupId}`);

    if(deleteSkill.data.status == 200){
        return deleteSkill.data;
    }else{
        if(typeof deleteSkill.data.error == 'string'){
            throw new Error(deleteSkill.data.error)
        }else{
            throw deleteSkill.data.error
        }
    }
}