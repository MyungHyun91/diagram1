import {_MOD} from "/diagram/diagram.js"
import {_SPACE} from "./space.js"
import {_WIN} from "../main/main.js"

export class _MAIN extends _SPACE
{
    constructor()
    {
        super(0,0,0,0);
        this.checked = false;
        this._info = {};
    }

    async Init(info)
    {
        for(let key in info)
        {
            this[key] = info[key];
        }
    }

    GetInfo()
    {
        const info = {
            key: this.key,
            title: this.title,
            type: this.type,
            x: this.x,
            y: this.y,
            z: this.z,
            width: this.width,
            height: this.height,
            memo: this.memo,
            link: this.link
        };
        return info;
    }

    Draw()
    {
        const x = _WIN.WindowX(this.x);
        const y = _WIN.WindowY(this.y);
        const width = _WIN.WindowLine(this.width);
        const height = _WIN.WindowLine(this.height);


        _WIN.ctx.save();
        
        const titleHeight = _WIN.WindowLine(30);
        // 테두리 그리기
        _WIN.ctx.strokeStyle = "rgba(0,0,0,1)";
        _WIN.ctx.strokeRect(x-1, y-1-titleHeight, width+2, height+titleHeight+2);

        // content 그리기
        _WIN.ctx.fillStyle = "orange";
        _WIN.ctx.fillRect(x, y, width, height);

        // title 그리기
        _WIN.ctx.fillStyle = "rgb(62, 62, 62)";
        _WIN.ctx.fillRect(x, y-titleHeight, width, titleHeight);
        
       

        // 메모 작성                
        _WIN.ctx.font = (18/_WIN.zoom) + "px Arial";
        _WIN.ctx.fillStyle = "black";
        _WIN.ctx.textAlign = "left"; // 수평 가운데 정렬
        _WIN.ctx.textBaseline = "middle"; // 수직 가운데 정렬
        if(this.memo)
        {
            const memo = this.memo.split("\n");
            for(let i=0; i<memo.length; i++)
            {
                _WIN.ctx.fillText(memo[i], x + 20/_WIN.zoom, y + (20 + 18*i)/_WIN.zoom);
            }
        }

        // 타이틀 작성
        _WIN.ctx.fillStyle = "white";
        _WIN.ctx.fillText(this.title, x + 20/_WIN.zoom, y - _WIN.WindowLine(18));


        if(this.checked == true)
        {
            _WIN.ctx.strokeStyle = "white";
            _WIN.ctx.lineWidth = 2;
            _WIN.ctx.strokeRect(x-3, y-3, width+6, height+6);
        }
        _WIN.ctx.restore();
    }

    DrawHover()
    {
        const x = _WIN.WindowX(this.x);
        const y = _WIN.WindowY(this.y);
        const width = _WIN.WindowLine(this.width);
        const height = _WIN.WindowLine(this.height);
        _WIN.ctx.strokeStyle = "rgba(0,255,0,0.5)";
        _WIN.ctx.lineWidth = 2;
        _WIN.ctx.strokeRect(x-3, y-3, width+6, height+6);
    }
}



