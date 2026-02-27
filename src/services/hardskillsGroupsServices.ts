import type { IHttpResponse, IHardskillsGroupsData } from "@/utils/interfaces";
import axios from "axios";

const url:string = 'http://localhost:3000/hardskillsGroups'

export async function getHardskillsGroupsData():Promise<IHardskillsGroupsData[]>{
    const data:IHttpResponse = await axios.get(url);
    if(data.data.status == 200){
        return data.data.body as IHardskillsGroupsData[]
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