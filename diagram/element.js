

export default class _DIAGRAM_ELEMENT
{
    constructor()
    {
    }

    static create(type, parentElement)
    {
        const element = document.createElement(type);
        
        if(parentElement == null) {parentElement = document.body;}
        parentElement.appendChild(element);
        
        return element;
    }
}