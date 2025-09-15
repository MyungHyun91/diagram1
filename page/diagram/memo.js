import {_MOD} from "/diagram/diagram.js"
import {_AXIS} from "../axis.js"
import {_WIN} from "../main/main.js"

export class _MAIN extends _AXIS
{
    constructor()
    {
        super(0,0,0,0);
        
        /**
         * [메모의 db 구성]
         * key: 다이어그램 key
         * type: "memo"
         * info : {
         *      x,     : 좌표 및 크기. 타이틀+콘텐츠 높이
         *      y, 
         *      width, 
         *      height,
         *      title, : 제목 및 내용
         *      content
         * }
         */

        this.checked = false;
        this.key = null;
        this.type = "memo";
        this.info.title = "";
        this.info.content = "";
        
    }
    async Init() {}
    Load(key, info)
    {
        this.key = key;
        for(let name in info)
        {
            this.info[name] = info[name];
        }

        // resize
        this.x = info.x??0;
        this.y = info.y??0;
        this.width = info.width??100;
        this.height = info.height??100;
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
        if(this.info.content)
        {
            const content = this.info.content.split("<br>");
            for(let i=0; i<content.length; i++)
            {
                _WIN.ctx.fillText(content[i], x + 20/_WIN.zoom, y + (20 + 18*i)/_WIN.zoom);
            }
        }

        // 타이틀 작성
        _WIN.ctx.fillStyle = "white";
        _WIN.ctx.fillText(this.info.title, x + 20/_WIN.zoom, y - _WIN.WindowLine(18));


        if(this.checked == true)
        {
            _WIN.ctx.strokeStyle = "white";
            _WIN.ctx.lineWidth = 2;
            _WIN.ctx.strokeRect(x-3, y-3, width+6, height+6);
        }
        _WIN.ctx.restore();

        this.DrawDeleteButton();
        this.DrawSpaceButton();
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

    DrawDeleteButton()
    {
        if(!this.checked) return;

        const x = _WIN.WindowX(this.x + this.width - 30);
        const y = _WIN.WindowY(this.y + 30);

        _WIN.ctx.save();

        // 삭제버튼 그리기
        _WIN.ctx.beginPath();
        _WIN.ctx.arc(x, y, 20/_WIN.zoom, 0, Math.PI*2);
        _WIN.ctx.fillStyle = "red";
        _WIN.ctx.fill();
        _WIN.ctx.closePath();

        _WIN.ctx.font = (32/_WIN.zoom) + "px Arial";
        _WIN.ctx.fillStyle = "white";
        _WIN.ctx.textAlign = "center"; // 수평 가운데 정렬
        _WIN.ctx.textBaseline = "middle"; // 수직 가운데 정렬
        _WIN.ctx.fillText("x", x, y);
        _WIN.ctx.restore();
    }

    IsDeleteButtonClick(clickX, clickY)
    {
        const x = _WIN.WindowX(this.x + this.width - 30);
        const y = _WIN.WindowY(this.y + 30);
        
        const dx = clickX - x;
        const dy = clickY - y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance <= 20/_WIN.zoom)
        {
            return true;
        }
        return false;
    }   

    // 스페이스 그리기
    DrawSpaceButton()
    {
        if(!this.checked) return;

        const x = _WIN.WindowX(this.x + this.width - 30);
        const y = _WIN.WindowY(this.y + 80);

        _WIN.ctx.save();

        // 삭제버튼 그리기
        _WIN.ctx.beginPath();
        _WIN.ctx.arc(x, y, 20/_WIN.zoom, 0, Math.PI*2);
        _WIN.ctx.fillStyle = "green";
        _WIN.ctx.fill();
        _WIN.ctx.closePath();

        _WIN.ctx.font = (15/_WIN.zoom) + "px Arial";
        _WIN.ctx.fillStyle = "white";
        _WIN.ctx.textAlign = "center"; // 수평 가운데 정렬
        _WIN.ctx.textBaseline = "middle"; // 수직 가운데 정렬
        _WIN.ctx.fillText("space", x, y);
        _WIN.ctx.restore();
    }

    IsSpaceButtonClick(clickX, clickY)
    {
        const x = _WIN.WindowX(this.x + this.width - 30);
        const y = _WIN.WindowY(this.y + 80);
        
        const dx = clickX - x;
        const dy = clickY - y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance <= 20/_WIN.zoom)
        {
            return true;
        }
        return false;
    }   
}



