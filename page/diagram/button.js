import {_AXIS} from "../axis.js"

export class _MAIN extends _AXIS
{
    constructor()
    {
        super("button");
        this.info = {};
    }
    async Init(parent) 
    {
        this.parent = parent;
    }
    Load(info)
    {
        this.key = info.key??this.key;
        for(let name in info)
        {
            this.info[name] = info[name];
        }

        // resize
         this.x = info.x??this.x;
        this.y = info.y??this.y;
        this.width = info.width??this.width;
        this.height = info.height??this.height;

        this.Draw();
    }

    Draw()
    {
        // 캡처 사이즈 초기화
        this.cav.width = this.width;
        this.cav.height = this.height;

        this.ctx.fillStyle = this.info.backgroundColor ?? "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.info.text, 0, 10);

        this.DrawChildren();
    }


}



