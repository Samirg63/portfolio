import type { IHttpResponse, IAboutData } from "@/utils/interfaces";
import axios from "axios";
import { destroyFile, uploadFile } from "./filesServices";


const url:string = import.meta.env.VITE_API_URL+'/about'

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
        const upload:{url:string,id:string} = await uploadFile(formdata)

        const imageData = (await getAboutKeyData('image') as {image:string | null}).image;
        if(imageData){
            const imageId = JSON.parse(imageData).id
    
            
                await destroyFile(imageId)
            
        }
        
        const edit = await editAboutData({id:id,image:JSON.stringify({url:upload.url,id:upload.id})} as IAboutData)
        return edit;
    } catch (error) {
        throw error
    }
    
    
}

export async function removeImage(id:number,imageId:string){
     try {
         const deleteImage = await destroyFile(imageId);
        if(deleteImage){
            const destroy:IHttpResponse = await axios.delete(url+`/image/${id}`)
            if(destroy.data.status == 200){
                return destroy.data.body as IAboutData
            }else{
                if(typeof destroy.data.error == 'string'){
                    throw new Error(destroy.data.error)
                }else{
                    throw destroy.data.error
                }
    }
        }
     } catch (error) {
         throw error
     }
}