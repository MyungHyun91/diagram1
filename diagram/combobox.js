import {_MOD} from "./diagram.js"

export default class _DIAGRAM_COMBOBOX
{
    constructor(type, style, parentElement)
    {
    }

    async Init(type, style, parentElement)
    {
        this.type = type;

        // 껍질
        this.body = document.createElement("div");
        this.body.classList.add("_diagram_combobox_body");

        // 드롭다운
        this.select = document.createElement("div");
        this.select.classList.add("_diagram_combobox_select");
        this.select.style.display = "none"; // 인라인 스타일 추가

        // 입력창
        if(type == "none")
        {
            this.input = document.createElement("div");
            this.input.classList.add("_diagram_combobox_none");
        }
        else
        {
            this.input = document.createElement("input");
            this.input.classList.add("_diagram_combobox_input");
            this.input.type = type ?? "text";
        }

        // css 파일 추가
        const css = _MOD.CloneCSS("combobox");
        parentElement.appendChild(css);
        if(style) {
            this.body.classList.add(style);
        } 

        // 자식 등록
        this.body.appendChild(this.input);
        this.body.appendChild(this.select);
        parentElement.appendChild(this.body);

        // 이벤트 추가
        if(this.type == "none")
        {
            this.input.addEventListener("mousedown", e =>
            {
                e.preventDefault();
            });
        }
        
        this.input.addEventListener("click", e =>
        {
            this.select.style.display = (this.select.style.display == "none")? "block":"none";
        });
        
        this.input.addEventListener("blur", e =>
        {
            this.select.style.display = "none";
        });

        this.select.addEventListener("mousedown", e =>
        {
            // this.select.style.display = "none";
            e.preventDefault();
            if(e.target === this.select) return;
            
            if(this.type == "none") {this.input.textContent = e.target.value;}
            else {this.input.value = e.target.value;}
            this.select.style.display = "none";
            const dispEvent = new Event("textChanged");
            this.input.dispatchEvent(dispEvent);
        });

    }

    Add(array)
    {
        if(!Array.isArray(array)) return;

        for(const item of array)
        {
            const option = document.createElement("div");
            option.value = item.value;
            option.textContent = item.title ?? item.value;
            if(item.selected) this.input.value = item.value;
            
            this.select.appendChild(option);
        }
    }

    OnTextChanged(call)
    {
        this.input.addEventListener("textChanged", e =>
        {
            call(this.input.textContent);
        });
    }

    static async create(type, style, list, parentElement)
    {  
        const combo = new _DIAGRAM_COMBOBOX();
        await combo.Init(type, style, parentElement);
        combo.Add(list);
        return combo;
    }
}