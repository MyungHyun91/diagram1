
import {_MAN, _MEU, _GRD, _IFO, _WIN, _EDT, _STO} from "../main/main.js"

export class _CONTROLLER
{
    constructor(parent)
    {
        this.parent = parent;
        this.cav = parent.cav;
        this.ctx = parent.ctx;
        this.move = {x:null, y:null, hover:null};
        this.down = {x:null, y:null, item:null, edge:null, is:false};
        this.up = {item:null, isUpdate:false, line:false};
        this.check = {list:[]};
        this.line = {is:false, item:null};
        this._work = "default"; // work 참조

        // 맵 확대,축소 및 접속
        this.cav.addEventListener("wheel", (e) => 
        {
            // 1. 최소화에서 휠 계속하면 부모 스페이스로 가기
            // 2. 상자 클릭상태에서 키우기 -> 상자 스페이스 접속 (스페이스 딱지 붙이자)
            // 3. 그외. 확대 및 축소

            if(e.deltaY > 0) {this.parent.zoom += 0.2;}
            else if(e.deltaY < 0) {this.parent.zoom -= 0.2;}
            else {return;}
            this.parent.Draw();
        }, {passive: true});

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
            this.down.item = _GRD.FindToPos(_WIN.SpaceX(e.offsetX), _WIN.SpaceY(e.offsetY));
            this.down.edge = null; // 상자 모서리 드래그 관련 초기화

            this.up.isUpdate = false;

            if(this.up.item)
            {
                this.down.edge = this.EdgeCheck(
                    _WIN.SpaceX(e.offsetX), _WIN.SpaceY(e.offsetY), this.up.item);
            }
        });

        this.cav.addEventListener("mousemove", (e) => 
        {
            // 선택된 상자 테두리 커서 있을시 마우스이미지 변경
            if(this.up.item)
            {
                const edge = this.EdgeCheck(
                    _WIN.SpaceX(e.offsetX), _WIN.SpaceY(e.offsetY), this.up.item);
                if(edge) {_WIN.cav.style.cursor = edge.cursor;}
                else {_WIN.cav.style.cursor = "default";}
            }

            // 상자라인 hover 기능
            this.Hover(e.offsetX, e.offsetY)
            if(this.line.is)
            {
                _WIN.Draw();
                _WIN.DrawLine(
                    _WIN.WindowX(this.line.item.x+this.line.item.width/2), 
                    _WIN.WindowY(this.line.item.y+this.line.item.height/2),
                    e.offsetX,
                    e.offsetY,
                    "green");
            }
           

            if(this.down.is == false) {return;}
            
            const rangeX = (e.offsetX-this.move.x)*this.parent.zoom;
            const rangeY = (e.offsetY-this.move.y)*this.parent.zoom;
   
            // 모서리 드래그로 상자 크기변경
            if(this.down.edge && this.down.edge.cursor != "default")
            {
                this.ResizeSquare(rangeX, rangeY, this.down.edge.compass, 
                    this.up.item);
                this.up.isUpdate = true;
            }
            // 체크된 상자 드래그로 옮기기(다중이동, 상자 내 다운)
            else if(this.up.item && this.down.item == this.up.item)
            {
                this.up.item.x += rangeX;
                this.up.item.y += rangeY;
                this.up.isUpdate = true;
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
            this.down.is = false; // down 초기화
            const isClick = (Math.abs(this.down.x-e.offsetX) < 10 
                && Math.abs(this.down.y-e.offsetY) < 10)? true:false;
            const find = _GRD.FindToPos(
                this.parent.SpaceX(e.offsetX),
                this.parent.SpaceY(e.offsetY));

            // 선택도형 db 업데이트(이동 및 크기변경시)
            // if(this.up.item && this.down.item == this.up.item && this.up.isUpdate)
            if(this.up.item && this.up.isUpdate)
            {
                await _STO.SaveDiagram(this.up.item);
                this.up.isUpdate = false;
            }

            switch(this.work)
            {
                case null:
                case "default":
                    if(isClick)
                    {
                        // 라인 or 상자 삭제버튼 클릭했는지 판단
                        if(this.up.item)
                        {
                            // 상자삭제버튼 클릭
                            if(this.up.item.IsDeleteButtonClick(e.offsetX, e.offsetY))
                            {
                                if(confirm("정말 삭제하시겠습니까?")){
                                    await _GRD.DeleteSquare(this.up.item.key);
                                    this.up.item = null;
                                }
                                break;
                            }

                            // 상자 스페이스 접속버튼 클릭
                            if(this.up.item.IsSpaceButtonClick(e.offsetX, e.offsetY))
                            {
                                await _GRD.Load(this.up.item.key)
                                break;
                            }

                            // 라인삭제버튼 클릭
                            const lines = _GRD.GetLinkedLine(this.up.item.key);
                            let lineClick = false;
                            for(let i=0; i<lines.length; i++)
                            {
                                if(lines[i].IsDeleteButtonClick(e.offsetX, e.offsetY))
                                {
                                    lineClick = true;
                                    await _GRD.DeleteLine(lines[i].key);
                                    break;
                                }
                            }
                            if(lineClick) {break;}
                        }
                        // 클릭한 부분이 상자가 아니면 선택된 상자 해제
                        if(this.up.item && this.up.item != find) 
                        {
                            this.up.item.checked = false;
                        }
                        else if(this.up.item && this.up.item == find)
                        {
                            // 같은거 두번클릭시 편집창 호출
                            _EDT.Load(this.up.item);
                            _EDT.display = true;
                            break;
                        }
                        // 상자선택
                        if(find) {
                            this.up.item = find;
                            find.checked = true;
                            _GRD.MoveItemSequence(find.key, -1);
                        }
                        else {
                            this.up.item = null;
                        }
                    }
                    break;
                case "square":
                    await _GRD.Add(null, "memo", 
                        {x: this.parent.SpaceX(e.offsetX),
                         y: this.parent.SpaceY(e.offsetY)});
                    _MEU.Toggle(null);
                    break;
                case "line":
                    if(this.line.is == false)
                    {
                        if(find) {
                            this.line.is = true;
                            this.line.item = find;
                            find.checked = true;
                        }
                    }
                    else
                    {    
                        if(find && this.line.item != find)
                        {
                            // 라인 저장
                            await _GRD.Add(null, "line", 
                                {squareKey1:this.line.item.key, squareKey2:find.key});
                           
                        }
                        this.line.is = false;
                        this.line.item.checked = false;
                        this.line.item = null;
                        _MEU.Toggle(null);
                    }
                    break;
            }
            this.parent.Draw();
        });

        this.cav.addEventListener("mouseleave", (e) => 
        {
            this.down.is = false;
            this.Hover();
        });
    }

    get work()
    {
        return this._work;
    }
    /**
     * [type]
     * default: map move,
     * square: square make
     * line: line make
     */
    set work(type)
    {
        this._work = type;
    }

    // 도형 및 라인에 hover 기능
    Hover(offsetX, offsetY)
    {
        if(!offsetX || !offsetY) {
            _WIN.Draw();
            this.move.hover = null;
            return;
        }
        const square = _GRD.FindToPos(_WIN.SpaceX(offsetX), _WIN.SpaceY(offsetY));
        if(square != this.move.hover) {
            _WIN.Draw();
            if(square) {square.DrawHover();}
        }
        this.move.hover = square;
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

    
    ResizeSquare(x, y, compass, square)
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