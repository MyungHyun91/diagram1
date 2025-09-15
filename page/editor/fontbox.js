import {_MOD, _CONFIG} from "/diagram/diagram.js"
import {_EDT} from "../main/main.js"

export class _MAIN
{
    constructor()
    {
    }

    async Init()
    {
        
        // 글자크기
        this.fontSize = await _MOD.combobox.create("number", "font-size", 
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
        this.fontSize.input.addEventListener("input", e =>
        {
            console.log("변경");

        });
        this.fontSize.select.addEventListener("mouseup", e =>
        {
            console.log("mouseup");
            _EDT.title.page.SetCaret();
        });

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

        // 상자삭제
        this.delete = _MOD.element.create("div", this.parentElement);
        this.delete.textContent = "삭제";
        this.delete.classList.add("font-style");
        this.delete.setAttribute("tabindex", "-1");
        // this.delete.style.fontWeight = "bold";
        this.delete.style.color = "red";

        // 이벤트
        this.bold.addEventListener("click", e =>
        {
            this.bold.classList.toggle("font-style-click");

            // 눌렸는지 판단.
            if(this.bold.classList.contains("font-style-click")) 
            {
                console.log("볼드체 적용")
            }
        });
        this.bold.addEventListener("focus", e =>
        {
            console.log("포커싱")
        });


        this.italic.addEventListener("click", e =>
        {
            this.italic.classList.toggle("font-style-click");
            if(this.italic.classList.contains("font-style-click")) 
            {
                console.log("이태리체 적용")
            }
        });

        this.delete.addEventListener("click", e =>
        {
            // 상자 삭제
            _EDT.Delete();
        });

    }

    Get()
    {
        const font = {
            color: this.colorPicker.value, 
            fontSize: this.fontSize.input.value + "px", 
            textDecoration: "none", // none
            fontStyle: (this.italic.classList.contains("font-style-click"))? "italic":"normal", // normal
            fontWeight: (this.bold.classList.contains("font-style-click"))? "bold":"normal" // normal
        };
        return font;
    }

    Set(font)
    {
        return;
        // if문으로 해보자
        this.colorPicker.value = font.color;
        this.fontSize.input.value = font.fontSize.replace("px", "");

        if(font.fontStyle == "italic") this.italic.classList.add("font-style-click");
        else this.italic.classList.remove("font-style-click");

        if(font.fontWeight == "bold") this.bold.classList.add("font-style-click");
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
        this.select.setAttribute("tabindex", "-1"); // 포커스 가능하게 변경

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
        this.select.addEventListener("click", e =>
        {
            console.log("?")
            this.popup.style.display = "block";
            this.popup.focus();
        });
        this.popup.addEventListener("click", e =>
        {
            if(e.target.style.backgroundColor)
            {
                this.select.style.backgroundColor = 
                    e.target.style.backgroundColor;
                this.popup.style.display = "none";
            }
        });
        this.popup.addEventListener("focusout", (e) => 
        {
            if(e.relatedTarget == this.select) return;
            this.popup.style.display = "none";
        });
    }   
}