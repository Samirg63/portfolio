import type { IHttpResponse } from "@/utils/interfaces";
import axios from "axios";


const url:string = import.meta.env.VITE_API_URL+'/files'


export async function uploadFile(formdata:FormData){
    
    try {
        const result:IHttpResponse = await axios.post(url+'/upload',formdata)
        return result.data.body as {url:string,id:string}
        
    } catch (error) {
        throw error;
    }
}

export async function uploadFiles(formdata:FormData){
    
    const result:IHttpResponse = await axios.post(url+'/uploadMany',formdata)

    if(result.data.status == 200){
        
            return result.data.body as {url:string,id:string}[]
    }else{
        
        if(typeof result.data.error == 'string'){
            throw new Error(result.data.error)
        }else{
            throw result.data.error
        }
    }
}

export async function destroyFile(id:string){
    const result:IHttpResponse = await axios.post(url+`/destroy/${id}`);

    if(result.data.status == 200){
        return result.data.status;
    }else{
        if(typeof result.data.error == 'string'){
            throw new Error(result.data.error)
        }else{
            throw result.data.error
        }
    }
}


export async function destroyMany(images:{url:string,id:string}[]){
    
    const destroyMany = await axios.post(url+`/destroyMany`,JSON.stringify({files:images}),{
        headers:{
            'Content-Type':'application/json'
        }
    })

    if(destroyMany.data.status == 200){
        
        return destroyMany.data.status
    }else{
        
        if(typeof destroyMany.data.error == 'string'){
            throw new Error(destroyMany.data.error)
        }else{
            throw destroyMany.data.error
        }
    }
}
