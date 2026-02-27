import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import Tooltip from 'primevue/tooltip';
import {QuillEditor} from '@vueup/vue-quill'
import NuxtUI from '@nuxt/ui/vue-plugin'


//icons
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as Icons from 'oh-vue-icons/icons';
const Ic = Object.values({...Icons})
addIcons(...Ic)
//import {  FaPen,BiChevronDown,BiPlusLg,BiTrashFill,IoCloseCircleSharp,BiPlusCircleFill,BiImages,BiEyeSlash,BiEye,BiArrowRightCircleFill,BiArrowLeftCircleFill,CoFindInPage,IoRemoveCircleSharp,BiWhatsapp,MdEmailRound,BiLinkedin,BiGithub,CoListFilter,BiSunFill,BiMoonFill,CoReact,BiChevronDoubleRight,CoVueJs,CoAngular,ViFileTypeCss } from "oh-vue-icons/icons";

//addIcons( FaPen,BiChevronDown,BiPlusLg,BiTrashFill,IoCloseCircleSharp,BiPlusCircleFill,BiImages,BiEyeSlash,BiEye,BiArrowRightCircleFill,BiArrowLeftCircleFill,CoFindInPage,IoRemoveCircleSharp,BiWhatsapp,MdEmailRound,BiLinkedin,BiGithub,CoListFilter,BiSunFill,BiMoonFill,CoReact,BiChevronDoubleRight,CoVueJs,CoAngular,ViFileTypeCss)

const app = createApp(App)

app.directive('tooltip', Tooltip);

app.use(NuxtUI)
app.use(router)
app.use(PrimeVue)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.component("v-icon",OhVueIcon)
app.component('QuillEditor',QuillEditor)
app.mount('#app')
