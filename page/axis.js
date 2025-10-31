
export class _AXIS
{
    constructor()
    {
        this.type = "axis";
        this._axis = {x: 0, y: 0, width: 100, height: 100};

        // 캡처용 캔버스
        const cav = document.createElement("canvas");
        const ctx = cav.getContext("2d");
        this._capture = {cav: cav, ctx: ctx};

        this._children = []; // 자식 diagram 저장공간
    }

    get x()
    {
        return Math.round(this._axis.x);
    }
    set x(x)
    {
        this._axis.x = Math.round(x);
    }

    get y()
    {
        return Math.round(this._axis.y);
    }
    set y(y)
    {
        this._axis.y = Math.round(y);
    }

    get width()
    {
        return this._axis.width;
    }
    set width(width)
    {
        this._axis.width = Math.round(width);
    }
    
    get height()
    {
        return this._axis.height;
    }
    set height(height)
    {
        this._axis.height = Math.round(height);
    }

 

    get cav()
    {
        return this._capture.cav;
    }
    get ctx()
    {
        return this._capture.ctx;
    }

    get children()
    {
        return this._children;
    }
    
    get rootX()
    {
        let root = this.parent;
        let x = this.x;
        while(root)
        {
            if(root.type === "window" || root.type == null) break;
            
            x += root.x;
            root = root.parent;
        }
        return x;
    }
    get rootY()
    {
        let root = this.parent;
        let y = this.y;
        while(root)
        {
            if(root.type === "window" || root.type == null) break;
            
            y += root.y;
            root = root.parent;
        }
        return y;
    }

    // 최상위 _WIN 에 등록된 커버(memo, 자기가 최상위면 자기자신) 을 반환.
    GetRoot()
    {
        let root = this;
        while(root)
        {
            if(!root.parent) break;
            if(root.parent.type === "window" || root.parent.type == null) break;
            
            root = root.parent;
        }
        return root;
    }
    TypeLevel(type)
    {
        switch(type)
        {
            case "line": return 1;
            case "button": return 3;
            default: return 2;
        }
    }

    AppendChild(diagram)
    {
        // 부모 초기화
        diagram.parent = this;

        const diagramLevel = this.TypeLevel(diagram.type);
        const childs = this.children;

        for(let i=childs.length-1; i>=0; i--)
        {
            const child = childs[i];
            const childLevel = this.TypeLevel(child.type);

            if(childLevel <= diagramLevel) {
                childs.splice(i+1, 0, diagram);
                return;
            }
        }
        // 같은타입 못찾았을때
        childs.push(diagram);
    }
    RemoveChild(diagram)
    {
        this._children = this._children.filter(child => child !== diagram);
    }

    // 0:첫번째로, -1:마지막으로(라인은 앞으로, 사각형은 뒤로, 버튼은 맨 뒤로)
    // MoveChild(diagram)
    // {
    //     const childs = this.children;
    //     let splice;
    //     for(let i=0; i<childs.length; i++)
    //     {
    //         if(childs[i] == diagram){
    //             splice = childs.splice(i, 1)[0];
    //             break;
    //         } 
    //     }
    //     if(!splice) return false;

    //     const spliceLevel = this.TypeLevel(splice.type);
    //     // 상자일경우 뒤에서 버튼끝난 직후 바로 입력(전부 같은타입을 만날경우 그 다음length)
    //     for(let i=childs.length-1; i>=0; i--)
    //     {
    //         const child = childs[i];
    //         const childLevel = this.TypeLevel(child.type);
    //         if(childLevel <= spliceLevel) {
    //             childs.splice(i+1, 0, splice);
    //             return true;
    //         }
    //     }
    //     return false;

    //     // 비효율적. 자기자신이 최상단일경우 false 반환하도록
    // }
    MoveChild(diagram) 
    {
        const childs = this.children;
        const oldIndex = childs.indexOf(diagram);
        if (oldIndex === -1) return false;

        const splice = childs.splice(oldIndex, 1)[0];
        const spliceLevel = this.TypeLevel(splice.type);

        for (let i = childs.length - 1; i >= 0; i--) {
            const child = childs[i];
            const childLevel = this.TypeLevel(child.type);

            if (childLevel <= spliceLevel) {
                const newIndex = i + 1;
                // 위치가 같으면 굳이 다시 넣지 말고 false 반환
                if (newIndex === oldIndex) {
                    childs.splice(oldIndex, 0, splice); // 원래 자리 복원
                    return false;
                }
                childs.splice(newIndex, 0, splice);
                return true;
            }
        }

        // 최상단으로 가는 경우
        if (oldIndex === 0) {
            childs.splice(0, 0, splice); // 그대로라면 false
            return false;
        }

        childs.unshift(splice);
        return true;
    }

   
    IsCollision(spaceX, spaceY)
    {
        if(spaceX < this.rootX || spaceX > this.rootX + this.width) return null;
        if(spaceY < this.rootY || spaceY > this.rootY + this.height) return null;
        
        // 자식 재귀검사. 반환 null or diagram
        for(let i=this.children.length-1; i>=0; i--)
        {
            const child = this.children[i];
            const collision = child.IsCollision(spaceX, spaceY);
            if(collision) {return collision;}
        }
        return this;
    }

    FindChild(key)
    {
        if(!key) return null;
        for(let i=this.children.length-1; i>=0; i--)
        {
            const child = this.children[i];
            if(child.key === key) return child;
        }
        return null;
    }

    // 기본 draw (각 diagram 템플릿에서 override 할 것)
    Draw()
    {
        // 캡처 사이즈 초기화 (+초기화하며 클리어 효과)
        this.cav.width = this.width;
        this.cav.height = this.height;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.DrawChildren();
    }
    // 자식영역 draw
    DrawChildren()
    {
        for(let i=0; i<this.children.length; i++)
        {
            const child = this.children[i];
            child.Draw();
            this.ctx.drawImage(child.cav, child.x, child.y);
        }
    }

    Event(type, info)
    {
        if(this[type]) this[type](info);
    }
}