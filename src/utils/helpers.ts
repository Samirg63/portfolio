



export function getTheme(){
     if(localStorage.getItem('theme'))
            return JSON.parse(localStorage.getItem('theme')!).dark
    
     return false;
}

export function handleTheme(value:boolean){
    if(value){
        document.getElementsByTagName('html')[0]?.classList.add('dark')
        localStorage.setItem('theme',JSON.stringify({dark:true}))
    }else{ 
        document.getElementsByTagName('html')[0]?.classList.remove('dark')
        localStorage.setItem('theme',JSON.stringify({dark:false}))
    }
}

export function formatLink(link:string){
    if(link.includes('http')){
        return link
    }else{
        return 'https://'+link
    }
}