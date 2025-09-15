import {_MOD} from "/diagram/diagram.js"

export class _AXIS
{
    constructor()
    {
        this.info = {x: 0, y: 0, width: 0, height: 0};
    }

    get x()
    {
        return Math.round(this.info.x);
    }
    set x(x)
    {
        this.info.x = Math.round(x);
    }

    get y()
    {
        return Math.round(this.info.y);
    }
    set y(y)
    {
        this.info.y = Math.round(y);
    }

    get width()
    {
        return this.info.width;
    }
    set width(width)
    {
        this.info.width = Math.round(width);
    }
    
    get height()
    {
        return this.info.height;
    }
    set height(height)
    {
        this.info.height = Math.round(height);
    }
}