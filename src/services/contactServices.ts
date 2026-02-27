import type { IHttpResponse, IContactData } from "@/utils/interfaces";
import axios from "axios";

const url:string = 'http://localhost:3000/contact'

export async function getContactData():Promise<IContactData>{
    const data:IHttpResponse = await axios.get(url);
    
    if(data.data.status == 200){
        return data.data.body as IContactData
    }else{
        if(typeof data.data.error == 'string'){
            throw new Error(data.data.error)
        }else{
            throw data.data.error
        }
    }
}

export async function editContactData(contactData:IContactData){
    const edit:IHttpResponse = await axios.put(url+`/${contactData.id}`,JSON.stringify(contactData),{
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