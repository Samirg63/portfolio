import type { IHttpResponse, ITagsGroupsData } from "@/utils/interfaces";
import axios from "axios";

const url:string = 'http://localhost:3000/tagsGroups'

export async function getTagsGroupsData():Promise<ITagsGroupsData[]>{
    const data:IHttpResponse = await axios.get(url);
    if(data.data.status == 200){
        return data.data.body as ITagsGroupsData[]
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function createTagsGroups(groupData:{name:string}){
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

export async function editTagGroup(data:ITagsGroupsData){
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

export async function deleteTagsGroup(id:number){
    const deleteGroup = await axios.delete(url+`/${id}`);
    console.log(deleteGroup)
    
    if(deleteGroup.status == 200){
        return deleteGroup.data;
    }else{
        if(typeof deleteGroup.data.error == 'string'){
            throw new Error(deleteGroup.data.error)
        }else{
            throw deleteGroup.data.error
        }
    }
}

export async function deleteTagsOnGroup(groupId:number){
    const deleteTags = await axios.delete(url+`/allGroup/${groupId}`);

    if(deleteTags.data.status == 200){
        return deleteTags.data;
    }else{
        if(typeof deleteTags.data.error == 'string'){
            throw new Error(deleteTags.data.error)
        }else{
            throw deleteTags.data.error
        }
    }
}