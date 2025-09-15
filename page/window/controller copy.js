
import {_MAN, _MEU, _GRD, _IFO, _WIN, _EDT} from "../main/main.js"

export class _CONTROLLER
{
    constructor(parent)
    {
        this.parent = parent;
        this.cav = parent.cav;
        this.ctx = parent.ctx;
        this.move = {x:null, y:null};
        this.down = {x:null, y:null, item:null, edge:null, is:false};
        this.up = {doubleClickDelay:250};
        this.check = {list:[]};
        this._work = 0; // work 참조

        this.cav.addEventListener("wheel", (e) => 
        {
            if(e.deltaY > 0) {this.parent.zoom += 0.2;}
            else if(e.deltaY < 0) {this.parent.zoom -= 0.2;}
            else {return;}
            this.parent.Draw();
        }, {passive: true});

        this.cav.addEventListener("dblclick", (e) => 
        {
            if(this.check.list.length == 1)
            {
                _EDT.Load(this.check.list[0]);
                _EDT.display = true;
            }
        });

        this.cav.addEventListener("mousedown", (e) => 
        {
            /**
             * 1. 상자를 눌렀는지 : down.item 에 값 넣기
             * 2. 상자 모서리를 눌렀는지 : 크기조정 준비
             * 3. 배경을 눌렀는지 : down.item 에 값 넣기
             * 4. (추가) 상자안의 버튼(링크등) 클릭
             */
            this.down.is = true;
            this.move.x = e.offsetX;
            this.move.y = e.offsetY;
            this.down.x = e.offsetX;
            this.down.y = e.offsetY;
            this.down.item = _GRD.Find(_WIN.SpaceX(e.offsetX), _WIN.SpaceY(e.offsetY));
            
            // 상자 모서리 드래그 관련 초기화
            
            this.down.edge = null;
            if(this.check.list.length == 1)
            {
                this.down.edge = this.EdgeCheck(
                    _WIN.SpaceX(e.offsetX), _WIN.SpaceY(e.offsetY), this.check.list[0]);
            }
        });

        this.cav.addEventListener("mousemove", (e) => 
        {
            /**
             * 1. 상자가 선택 안되어있으면: 실시간 이동
             * 2. 상자가 선택되어 있으면: edgecheck
             */
            if(this.check.list.length == 1)
            {
                const edge = this.EdgeCheck(
                    _WIN.SpaceX(e.offsetX), _WIN.SpaceY(e.offsetY), this.check.list[0]);
                if(edge) _WIN.cav.style.cursor = edge.cursor;
                else _WIN.cav.style.cursor = "default";
            }

            if(this._work == 0)
            {
                
            }

            if(this.down.is == false) {return;}
            
            const rangeX = (e.offsetX-this.move.x)*this.parent.zoom;
            const rangeY = (e.offsetY-this.move.y)*this.parent.zoom;
   
            // 모서리 드래그로 상자 크기변경
            if(this.down.edge && this.down.edge.cursor != "default")
            {
                this.SizeSquare(rangeX, rangeY, this.down.edge.compass, 
                    this.check.list[0]);
                _IFO.Input(this.check.list[0])
            }
            // 체크된 상자 드래그로 옮기기(다중이동, 상자 내 다운)
            else if(this.check.list.length > 0)
            {
                for(let item of this.check.list)
                {
                    item.x += rangeX;
                    item.y += rangeY;    
                }
                _IFO.Move(
                    parseInt(rangeX, 10),
                    parseInt(rangeY, 10)
                );
            }
            // 맵 드래그로 이동하기
            else
            {
                this.parent.x -= rangeX;
                this.parent.y -= rangeY;
            }
            this.parent.Draw();
            this.move.x = e.offsetX;
            this.move.y = e.offsetY;
        });

        this.cav.addEventListener("mouseup", async (e) => 
        {
            this.down.is = false;

            if(this.check.list.length > 0)
            {
                for(const item of this.check.list)
                {
                    await _MAN.Update(item.GetInfo());
                }
            }

            // 클릭으로 판단되면 도형 클릭인지 찾자
            if(Math.abs(this.down.x-e.offsetX) < 10 
                && Math.abs(this.down.y-e.offsetY) < 10)
            {
                switch(_MEU.checked)
                {
                    case "square":
                        await _MAN.Insert({
                            x: this.parent.SpaceX(e.offsetX),
                            y: this.parent.SpaceY(e.offsetY)
                        });
                        _MEU.Toggle("square");
                        this.parent.Draw();
                        return;
                    case "line":
                        if(this.temp == null)
                        {
                            this.temp = this.parent.FindSquare(
                                this.parent.SpaceX(e.offsetX),
                                this.parent.SpaceY(e.offsetY)
                            );
                        }
                        else
                        {
                            const temp2 = this.parent.FindSquare(
                                this.parent.SpaceX(e.offsetX),
                                this.parent.SpaceY(e.offsetY)
                            );
                            await this.parent.AddLine(this.temp, temp2);
                            this.temp = null;
                            _MEU.Toggle("line");
                            this.parent.Draw();
                        }
                        return;
                }

                const find = _GRD.Find(
                    this.parent.SpaceX(e.offsetX),
                    this.parent.SpaceY(e.offsetY)
                );
                if(!find) 
                {
                    _MAN.UncheckAll();
                }
                else
                {
                    _MAN.ToggleCheck(find);
                }
                this.parent.Draw();
            }
            
            this.check.list = _GRD.GetChecked();
            this.parent.Draw();
        });

        this.cav.addEventListener("mouseleave", (e) => 
        {
            this.down.is = false;
        });
    }

    get work()
    {
        return this._work;
    }
    /**
     * [type]
     * 0: map move,
     * 1: square make
     * 2: line make
     * 3: editor visible
     */
    set work(type)
    {
        this._work = type;
    }

    // 상자 모서리에 마우스 커서가 올라가 있는지 체크
    EdgeCheck(spaceX, spaceY, square)
    {
        const range = 10;
        // 좌표가 상자 안에 들어있는지 체크
        if(square.x > spaceX+range || square.x+square.width < spaceX-range ||
            square.y > spaceY+range || square.y+square.height < spaceY-range)
        {return null;}
            
        let compass = "";
        let cursor = "default"; // 기본 화살표

        if(Math.abs(square.y - spaceY) < range) compass += "n"; // 상
        if(Math.abs(square.x + square.width - spaceX) < range) compass += "e"; // 우
        if(Math.abs(square.y + square.height - spaceY) < range) compass += "s"; // 하
        if(Math.abs(square.x - spaceX) < range) compass += "w"; // 좌
     
        if(compass == "nw" || compass == "es") cursor = "nwse-resize"; // 좌상우하 화살표
        else if(compass == "sw" || compass == "ne") cursor = "nesw-resize"; // 우상좌하 화살표
        else if(compass == "e" || compass == "w") cursor = "ew-resize"; // 좌우 화살표
        else if(compass == "n" || compass == "s") cursor = "ns-resize"; // 상하 화살표
        
        return {compass, cursor};
    }

    
    SizeSquare(x, y, compass, square)
    {
        switch(compass)
        {
            case "nw": // 북서
                square.x += x;
                square.y += y;
                square.width -= x;
                square.height -= y;
                break;
            case "es": // 동남
                square.width += x;
                square.height += y;
                break;
            case "sw": // 남서
                square.x += x;
                square.width -= x;
                square.height += y;
                break;
            case "ne": // 북동
                square.y += y;
                square.width += x;
                square.height -= y;
                break;
            case "e": // 동
                square.width += x;
                break;
            case "w": // 서
                square.x += x;
                square.width -= x;
                break;
            case "n": // 북
                square.y += y;
                square.height -= y;
                break;
            case "s": // 남
                square.height += y;
                break;
        }
    }
}