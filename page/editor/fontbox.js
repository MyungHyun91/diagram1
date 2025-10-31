import {_MOD, _CONFIG} from "../../diagram/diagram.js"
import {_EDT} from "../main/main.js"

export class _MAIN
{
    constructor()
    {
    }

    async Init()
    {
        // 배경색상
        this.backColorPicker = new _COLOR_PICKER(this.parentElement);
        this.backColorPicker.select.style.borderRadius = "4px";

        // 글자크기
        this.fontSize = await _MOD.combobox.create("none", "font-size", 
            [
                {value: 9, title: "9px", selected: true},
                {value: 11, title: "11px"},
                {value: 13, title: "13px"},
                {value: 18, title: "18px"},
                {value: 22, title: "22px"},
                {value: 32, title: "32px"},
                {value: 48, title: "48px"},
                {value: 72, title: "72px"},
            ], this.parentElement);
        this.fontSize.input.placeholder = "size";

        // 글자색상
        this.colorPicker = new _COLOR_PICKER(this.parentElement);
        
        // 글자굵기
        this.bold = _MOD.element.create("div", this.parentElement);
        this.bold.textContent = "B";
        this.bold.classList.add("font-style");
        this.bold.setAttribute("tabindex", "-1");
        this.bold.style.fontWeight = "bold";

        // 이탤릭체
        this.italic = _MOD.element.create("div", this.parentElement);
        this.italic.textContent = "I";
        this.italic.classList.add("font-style");
        this.italic.setAttribute("tabindex", "-1");
        this.italic.style.fontStyle = "italic";

        // 이벤트
        this.backColorPicker.SetEvent((color) =>
        {
            _EDT.textarea.page.text.style.backgroundColor = color;
        });
        this.fontSize.OnTextChanged(size =>
        {
            _EDT.textarea.page.StyleUpCaret({fontSize: size+"px"});
        });

        this.colorPicker.SetEvent((color) =>
        {
            _EDT.textarea.page.StyleUpCaret({color: color});
        });

        this.bold.addEventListener("click", e =>
        {
            this.bold.classList.toggle("font-style-click");
            const isContain = this.bold.classList.contains("font-style-click");
            _EDT.textarea.page.StyleUpCaret({fontWeight: (isContain)?"bold":"normal"});
        });

        this.italic.addEventListener("click", e =>
        {
            this.italic.classList.toggle("font-style-click");
            const isContain = this.italic.classList.contains("font-style-click");
            _EDT.textarea.page.StyleUpCaret({fontStyle: (isContain)?"italic":"normal"});
        });
    }

    Set(style)
    {
        this.colorPicker.value = style.color ?? "black";
        if(style.fontSize){
            this.fontSize.input.textContent = style.fontSize.replace("px", "");
        }
        else{
            this.fontSize.input.textContent = 22;
        }

        if(style.fontStyle == "italic") this.italic.classList.add("font-style-click");
        else this.italic.classList.remove("font-style-click");

        if(style.fontWeight == "bold") this.bold.classList.add("font-style-click");
        else this.bold.classList.remove("font-style-click");
    }
    SetBackgroundColor(color)
    {
        this.backColorPicker.select.style.backgroundColor = color;
    }

    Load(style)
    {
        this.backColorPicker.select.style.backgroundColor = style.backgroundColor;
        this.colorPicker.value = style.color ?? "black";
        if(style.fontSize){
            this.fontSize.input.textContent = style.fontSize.replace("px", "");
        }
        else{
            this.fontSize.input.textContent = 22;
        }

        if(style.fontStyle == "italic") this.italic.classList.add("font-style-click");
        else this.italic.classList.remove("font-style-click");

        if(style.fontWeight == "bold") this.bold.classList.add("font-style-click");
        else this.bold.classList.remove("font-style-click");
    }
}

class _COLOR_PICKER 
{
    constructor(parentElement)
    {
        this.parentElement = parentElement;
        this.palette = {
            default: ["black", "white", "red", "orange", "yellow",
                "green", "blue", "navy", "purple"]
        };
        
        // 컬러선택
        this.select = _MOD.element.create("div", this.parentElement);
        this.select.classList.add("picker-color");
        this.select.classList.add("picker-select");
        // this.select.setAttribute("tabindex", "-1"); // 포커스 가능하게 변경

        // 팝업
        this.popup = _MOD.element.create("div", this.parentElement);
        this.popup.classList.add("picker-popup");
        this.popup.setAttribute("tabindex", "-1"); // 포커스 가능하게 변경
        this.popup.style.display = "none";

        // 팔레트에 색정보 등록
        for(let item of this.palette.default)
        {
            const color = _MOD.element.create("div", this.popup);
            color.classList.add("picker-color");
            color.style.backgroundColor = item;
        }
        
        // 이벤트
        this.select.addEventListener("mousedown", e =>
        {
            e.preventDefault(); // 에디터 캐럿해제 막기위해 선언
        });
        this.select.addEventListener("mousedown", e =>
        {
            // e.preventDefault();
          
            this.popup.style.display = "block";
            this.popup.focus();
        });

        this.popup.addEventListener("mousedown", e =>
        {
            e.preventDefault(); // 에디터 캐럿해제 막기위해 선언
        });
        this.popup.addEventListener("click", e =>
        {
            if(e.target.style.backgroundColor)
            {
                this.select.style.backgroundColor = 
                    e.target.style.backgroundColor;
                this.popup.style.display = "none";
                if(this.eventCall) {
                    this.eventCall(e.target.style.backgroundColor);
                }
            }
        });
        this.popup.addEventListener("focusout", (e) => 
        {
            if(e.relatedTarget == this.select) return;
            this.popup.style.display = "none";
        });
    }
    get value()
    {
        return this.select.style.backgroundColor;
    }
    set value(color)
    {
        this.select.style.backgroundColor = color;
    }
    SetEvent(call)
    {
        this.eventCall = call;
    }
}