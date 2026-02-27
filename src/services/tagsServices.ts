import type { IHttpResponse, ITagsData } from "@/utils/interfaces";
import axios from "axios";

const url:string = 'http://localhost:3000/tags'

export async function getTagsDataByGroup(groupId:number):Promise<ITagsData[]>{
    const data:IHttpResponse = await axios.get(url+`/${groupId}`);
    if(data.data.status == 200){
        return data.data.body as ITagsData[]
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function createTags(itemData:{name:string},groupId:number){
    const data:IHttpResponse = await axios.post(url,JSON.stringify({tagGroupId:groupId,...itemData}),{
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