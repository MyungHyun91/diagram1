
import {_MOD, _CONFIG} from "/diagram/diagram.js"
import {_MAN, _MEU, _GRD} from "../main/main.js"
import {_AXIS} from "../axis.js"
import {_CONTROLLER} from "./controller.js"


export class _MAIN extends _AXIS
{
    constructor()
    {
        super(0, 0, 0, 0);
        this.scope = { 
            default: 1, min: 1, max: 4, zoom: 1
        };
        
        this.grid = {
            width: 200, height: 200
        };

        this.cav;
        this.ctx;
    }

    get zoom()
    {
        return this.scope.zoom;
    }
    set zoom(zoom)
    {
        if(zoom < this.scope.min) {this.scope.zoom = this.scope.min}
        else if(zoom > this.scope.max) {this.scope.zoom = this.scope.max}
        else {this.scope.zoom = zoom;}
    }

    SpaceX(mouseX)
    {
        const line = (this.cav.width/2 - mouseX)*this.zoom;
        return Math.round(this.x - line);
    }
    SpaceY(mouseY)
    {
        const line = (this.cav.height/2 - mouseY)*this.zoom;
        return Math.round(this.y - line);
    }
    SpaceLine(windowLine)
    {
        return Math.round(windowLine*this.zoom);
    }

    WindowX(spaceX)
    {
        return Math.round((spaceX - this.x)/this.zoom + this.cav.width/2);
    }
    WindowY(spaceY)
    {
        return Math.round((spaceY - this.y)/this.zoom + this.cav.height/2);
    }
    WindowLine(spaceLine)
    {
        return Math.round(spaceLine/this.zoom);
    }

    async Init()
    {
        // 1. 캔버스 생성
        this.cav = await _MOD.element.create("canvas", this.parentElement);
        this.ctx = this.cav.getContext("2d");

        // 2. 컨트롤러 생성
        this.controller = new _CONTROLLER(this);

        window.addEventListener("resize", (e) =>
        {
            this.Resize();
        });
        this.Resize();
    }

    Resize()
    {
        // const dpr = window.devicePixelRatio || 1;
        const dpr = 1;
        
        this.cav.width = window.innerWidth * dpr;
        this.cav.height = window.innerHeight * dpr;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(dpr, dpr);

        this.Draw();
    }

    Draw()
    {
        this.ctx.clearRect(0, 0, this.cav.width, this.cav.height);
        this.DrawBackground();

        for(let line of _GRD.line)
        {
            line.Draw();
        }
        for(let square of _GRD.square)
        {
            square.Draw();
        }
        for(let line of _GRD.line)
        {
            line.DrawDeleteButton();
        }

        this.DrawPoint(0, 0, "white") // 0점 표시
        if(this.controller.down.is == true)
        {
            this.DrawPoint(this.x, this.y, "rgb(200,0,0)");
        }
    }

    DrawPoint(spaceX, spaceY, color)
    {
        const windowX = this.WindowX(spaceX);
        const windowY = this.WindowY(spaceY);
        this.ctx.save();

        this.ctx.font = 18 + "px Arial";
        this.ctx.fillStyle = color;
        this.ctx.textAlign = "center"; // 수평 가운데 정렬
        this.ctx.textBaseline = "middle"; // 수직 가운데 정렬
        this.ctx.fillText(
            "(x:" + spaceX + " y:" + spaceY + ")",
            windowX, windowY + 20);

        this.ctx.beginPath();
        this.ctx.arc(windowX, windowY, 4, Math.PI*2, false);
        this.ctx.fill();

        this.ctx.restore();
        return {x: windowX, y: windowY};
    }

    DrawLine(windowX1, windowY1, windowX2, windowY2, color)
    {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(windowX1, windowY1);
        this.ctx.lineTo(windowX2, windowY2);
        this.ctx.strokeStyle = color;
        // this.ctx.lineWidth = 4;
        this.ctx.stroke();
        this.ctx.restore();
    }

    DrawBackground()
    {
        const width = this.WindowLine(this.grid.width);
        const height = this.WindowLine(this.grid.height);
       
        const sx = this.WindowX(0)%width - width; // 그리드 시작x
        const sy = this.WindowY(0)%height - height; // 그리드 시작y
        const cols = Math.ceil(this.cav.width/width) + 2;
        const rows = Math.ceil(this.cav.height/height) + 2;

        this.ctx.save();
        this.ctx.strokeStyle = "rgb(90, 90, 110)";
        this.ctx.lineWidth = (this.scope.min/this.zoom);
        this.ctx.beginPath();
        for(let col=0; col<cols; col++)
        {
            for(let row=0; row<rows; row++)
            {
                this.ctx.moveTo(sx+col*width, sy+row*height);
                this.ctx.lineTo(sx+(col+1)*width, sy+(row+1)*height);

                this.ctx.moveTo(sx+(col+1)*width, sy+row*height);
                this.ctx.lineTo(sx+col*width, sy+(row+1)*height);
            }
        }
        this.ctx.stroke();
        this.ctx.restore();
    }
}
