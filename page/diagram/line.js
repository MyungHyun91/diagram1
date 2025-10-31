import {_MOD} from "../../diagram/diagram.js"
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
        this.info = {
            x:0, y:0, width:0, height:0,
            squareKey1:null, squareKey2:null
        };
    }
    Load(info)
    {
        if(!info.squareKey1 || !info.squareKey2) return;
        this.key = info.key??this.key;
        for(let name in info)
        {
            this.info[name] = info[name];
        }
        // 상자들 로딩시점이 다 달라서 이런식으로는 힘들다
        this.square1 = _WIN.FindChild(this.info.squareKey1);
        this.square2 = _WIN.FindChild(this.info.squareKey2);
    }

    Draw()
    {
        this.square1 = _WIN.FindChild(this.info.squareKey1);
        this.square2 = _WIN.FindChild(this.info.squareKey2);
        if(!this.square1 || !this.square2) return;
        

        const x1 = _WIN.WindowX(this.square1.x + this.square1.width/2);
        const y1 = _WIN.WindowY(this.square1.y + this.square1.height/2);
        const x2 = _WIN.WindowX(this.square2.x + this.square2.width/2);
        const y2 = _WIN.WindowY(this.square2.y + this.square2.height/2);

        _WIN.ctx.save();
        _WIN.ctx.beginPath();
        _WIN.ctx.moveTo(x1, y1);
        _WIN.ctx.lineTo(x2, y2);
        _WIN.ctx.strokeStyle = "silver"; // "green";
        _WIN.ctx.lineWidth = 2;
        _WIN.ctx.stroke();
        _WIN.ctx.restore();
    }

    IsCollision()
    {
        return;
    }

}