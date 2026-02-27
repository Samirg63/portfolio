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