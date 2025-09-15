import {_MOD} from "/diagram/diagram.js"
import {_WIN, _GRD} from "../main/main.js"

export class _MAIN
{
    constructor()
    {
        this.checked = null;
    }

    async Init()
    {
        this.hide = await _MOD.button.create("/resource/icon/menu.svg", ["button"], this.parentElement);
        this.square = await _MOD.button.create("/resource/icon/add_square.png", ["button"], this.parentElement);
        this.line = await _MOD.button.create("/resource/icon/circuit.png", ["button"], this.parentElement);


        // 이벤트
        this.hide.onclick = async (e) =>
        {
            await _GRD.SpaceOut();
            _WIN.Draw();
        }
        this.square.onclick = (e) =>
        {
            this.Toggle("square");
        }
        this.line.onclick = (e) =>
        {
            this.Toggle("line");
        }
    }
    
    Toggle(btnName)
    {
        if(!this.checked) {
            this[btnName].classList.add("checked");
            this.checked = btnName;
        }
        else if(this.checked == btnName) {
            this.checked = null;
            this[btnName].classList.remove("checked");
        }
        else
        {
            this[this.checked].classList.remove("checked");
            this.checked = btnName;
            if(btnName){this[btnName].classList.add("checked");}
            
        }
        _WIN.controller.work = this.checked;
    }

    
}