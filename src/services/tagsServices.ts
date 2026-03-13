import type { IHttpResponse, ITagsData } from "@/utils/interfaces";
import axios from "axios";
import dotevn from 'dotenv'
dotevn.config()

const url:string = process.env.API_URL+'/tags'

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

export async function editTag(data:ITagsData){
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

export async function deleteTags(id:number){
    const deleteTags = await axios.delete(url+`/${id}`);

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

export async function searchTags(searchParams:string){
    
        
        const data = await axios.post(url+`/search`,JSON.stringify({search:searchParams}),{
            headers:{
                'Content-Type':'application/json'
            }
        });
        
        console.log(data)
        if(data.data.status == 200){
            return data.data.body;
        }else{
            if(typeof data.data.error == 'string'){
                throw new Error(data.data.error)
            }else{
                throw data.data.error
            }
        }

    
}