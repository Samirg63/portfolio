import type { IHttpResponse, IAboutData } from "@/utils/interfaces";
import axios from "axios";
import { destroyFile, uploadFile } from "./filesServices";

const url:string = 'http://localhost:3000/about'

export async function getAboutData():Promise<IAboutData>{
    const data:IHttpResponse = await axios.get(url);
    
    if(data.data.status == 200){
        return data.data.body as IAboutData
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function getAboutKeyData(key:string):Promise<{[key:string]:string | number}>{
    const data:IHttpResponse = await axios.get(url+`/${key}`);
    if(data.data.status == 200){
        return data.data.body as {[key:string]:string | number}
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}



export async function editAboutData(data:IAboutData){
    const edit:IHttpResponse = await axios.put(url+`/${data.id}`,JSON.stringify(data),{
        headers:{
            'Content-Type':'application/json'
        }
    });
    
    if(edit.data.status == 200){
        return edit.data
    }else{
        if(typeof edit.data.error == 'string'){
            throw new Error(edit.data.error)
        }else{
            throw edit.data.error
        }
    }
}

export async function editPortrait(formdata:FormData,id:number){
    //upload
    try {
        //delete past image (if it exists)
         const imageData = (await getAboutKeyData('image') as {image:string | null}).image;
         if(imageData){
             const imageId = JSON.parse(imageData).id
     
             
                 await destroyFile(imageId)
             
         }
        
        const upload:{url:string,id:string} = await uploadFile(formdata)
        const edit = await editAboutData({id:id,image:JSON.stringify({url:upload.url,id:upload.id})} as IAboutData)
        return edit;
    } catch (error) {
        throw error
    }
    
    
}