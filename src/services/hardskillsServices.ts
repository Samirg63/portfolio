import type { IHttpResponse, IHardskillsData } from "@/utils/interfaces";
import axios from "axios";

const url:string = 'http://localhost:3000/hardskills'

export async function getHardskillsDataByGroup(groupId:number):Promise<IHardskillsData[]>{
    const data:IHttpResponse = await axios.get(url+`/${groupId}`);
    if(data.data.status == 200){
        return data.data.body as IHardskillsData[]
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function createHardskills(itemData:{name:string},groupId:number){
    const data:IHttpResponse = await axios.post(url,JSON.stringify({hardskillsGroupId:groupId,...itemData}),{
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

export async function editHardskill(data:IHardskillsData){
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

export async function changeOrder(id:number,body:{newIndex:number,oldIndex:number,groupId:number}){
    const edit:IHttpResponse = await axios.put(url+`/order/${id}`,JSON.stringify(body),{
        headers:{'Content-Type':'application/json'}
    })

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

export async function deleteHardskill(id:number){
    const deleteSkill = await axios.delete(url+`/${id}`);

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