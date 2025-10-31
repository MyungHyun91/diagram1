import {_AXIS} from "../axis.js"
import {_CAP, _PTT} from "../main/main.js"

export class _MAIN extends _AXIS
{
    constructor()
    {
        super();
        this.type = "picture";
        this.checked = false;
        this.isDrag = true;
        this.info = {
            text: "", backgroundColor: null
        };
        this.textHeight = 0;

        this.img = new Image();
        this.cavPen = document.createElement("canvas");
        this.ctxPen = this.cavPen.getContext("2d");
        
    }
    
    async Load(info)
    {
        this.key = info.key??this.key;
        for(let name in info)
        {
            if(!info[name]) continue;
            this.info[name] = info[name];
        }
        
        // resize
        this.x = info.x??this.x;
        this.y = info.y??this.y;
        this.width = info.width??this.width;
        this.height = info.height??this.height;

        this.Draw();

        return new Promise((resolve) => {
            if(info.file) {
                this.img.src = URL.createObjectURL(info.file);
                this.img.onload = (e) =>
                {
                    this.width = info.width??this.img.width;
                    this.height = info.height??this.img.height;
                    this.Draw();
                    resolve();
                };
            }
            else {
                resolve();
            }
            
        });
        
    }

    Draw(gapX=0, gapY=0, gapWidth=0, gapHeight=0)
    {
        // 캡처 사이즈 초기화
        this.cav.width = this.width;
        this.cav.height = this.height;
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(0,0, this.width, this.height);
        this.ctx.drawImage(this.img, 0,0, this.width, this.height);

        this.DrawChildren();
    }

    onClick()
    {
        console.log("클릭");
        _PTT.Load(this);
        _PTT.display = true;
    }
    
}



