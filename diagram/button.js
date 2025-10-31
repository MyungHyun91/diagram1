import {_CONFIG} from "./diagram.js"

export default class _DIAGRAM_BUTTON
{
    constructor()
    {
    }

    async Init()
    {
    }

    static async create(src, styleList, parentElement)
    {
        const img = document.createElement("img");
        img.classList.add("_diagram_button");
        img.src = src;
        // img.alt = "버튼 이미지";
        
        
        for(let style of styleList)
        {
            img.classList.add(style);
        }
        
        if(parentElement == null) {parentElement = document.body;}

        // Shadow Dom에 공통 css 파일 추가
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = _CONFIG.dir.diagram + "/button.css";
        parentElement.appendChild(link);
        parentElement.appendChild(img);
        
        return img;
    }
}