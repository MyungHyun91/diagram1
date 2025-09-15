import {_MOD} from "/diagram/diagram.js"
import {_WIN, _GRD} from "../main/main.js"

export class _MAIN 
{
    constructor()
    {
        /**
         * [라인의 db 구성]
         * key: 다이어그램 key
         * type: "line"
         * info : {
         *      squareKey1, : 연결상자1
         *      squareKey2  : 연결상자2
         * }
         */

        this.checked = false;
        this.key = null;
        this.type = "line";
        this.info = {};
    }
    async Init() {}
    Load(key, info)
    {
        this.key = key;
        for(let name in info)
        {
            this.info[name] = info[name];
        }
        if(!this.info.squareKey1 || !this.info.squareKey2) return;

        this.square1 = _GRD.FindToKey(this.info.squareKey1);
        this.square2 = _GRD.FindToKey(this.info.squareKey2);
    }

    Draw()
    {
        if(!this.square1 || !this.square2) return;

        const x1 = _WIN.WindowX(this.square1.x + this.square1.width/2);
        const y1 = _WIN.WindowY(this.square1.y + this.square1.height/2);
        const x2 = _WIN.WindowX(this.square2.x + this.square2.width/2);
        const y2 = _WIN.WindowY(this.square2.y + this.square2.height/2);

        _WIN.ctx.save();
        _WIN.ctx.beginPath();
        _WIN.ctx.moveTo(x1, y1);
        _WIN.ctx.lineTo(x2, y2);
        _WIN.ctx.strokeStyle = "green";
        // _WIN.ctx.lineWidth = 4;
        _WIN.ctx.stroke();
    

        
        _WIN.ctx.restore();
    }

    DrawDeleteButton()
    {
        if(!this.square1 || !this.square2) return;

        if(this.square1.checked || this.square2.checked)
        {
            const x1 = _WIN.WindowX(this.square1.x + this.square1.width/2);
            const y1 = _WIN.WindowY(this.square1.y + this.square1.height/2);
            const x2 = _WIN.WindowX(this.square2.x + this.square2.width/2);
            const y2 = _WIN.WindowY(this.square2.y + this.square2.height/2);

            _WIN.ctx.save();

            // 삭제버튼 그리기
            _WIN.ctx.beginPath();
            _WIN.ctx.arc((x1+x2)/2, (y1+y2)/2, 10/_WIN.zoom, 0, Math.PI*2);
            _WIN.ctx.fillStyle = "red";
            _WIN.ctx.fill();
            _WIN.ctx.closePath();

            _WIN.ctx.font = (18/_WIN.zoom) + "px Arial";
            _WIN.ctx.fillStyle = "white";
            _WIN.ctx.textAlign = "center"; // 수평 가운데 정렬
            _WIN.ctx.textBaseline = "middle"; // 수직 가운데 정렬
            _WIN.ctx.fillText("x", (x1+x2)/2, (y1+y2)/2);

            _WIN.ctx.restore();
        }

    }

    IsDeleteButtonClick(clickX, clickY)
    {
        const x1 = _WIN.WindowX(this.square1.x + this.square1.width/2);
        const y1 = _WIN.WindowY(this.square1.y + this.square1.height/2);
        const x2 = _WIN.WindowX(this.square2.x + this.square2.width/2);
        const y2 = _WIN.WindowY(this.square2.y + this.square2.height/2);
        
        const dx = clickX - (x1+x2)/2;
        const dy = clickY - (y1+y2)/2;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if(distance <= 10/_WIN.zoom)
        {
            return true;
        }
        return false;
    }    

}