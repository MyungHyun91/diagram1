import {_MOD, _CONFIG} from "/diagram/diagram.js"
import {_MAN, _WIN, _GRD, _STO} from "../main/main.js"

export class _MAIN
{
    constructor()
    {
    }

    async Init()
    {
        this.diagram = null;

        // 1. 백그라운드
        this.background = _MOD.element.create("div", this.parentElement);
        this.background.classList.add("background");
        
        // 2. 커버
        this.cover = _MOD.element.create("div", this.background);
        this.cover.classList.add("cover");
        this.cover.style.width = "150px";
        this.cover.style.height = "250px";

        // 5. 폰트
        this.font = await _MOD.panel.create(
            _CONFIG.dir.page + "/editor/fontbox", this.cover);
        this.font.panel.classList.add("font");

        // 3. 제목
        this.title = await _MOD.panel.create(
            _CONFIG.dir.page + "/editor/textarea", this.cover);
        this.title.panel.classList.add("title");

        // 4. 내용
        this.content = await _MOD.panel.create(
            _CONFIG.dir.page + "/editor/textarea", this.cover);
        this.content.panel.classList.add("content");
        
       
        // 5. 이벤트
        this.background.addEventListener("mouseup", async e =>
        {
            if(e.target === this.background) {
                this.display = false;
                // 편집정보 저장
                this.diagram.info.title = this.title.page.text.innerHTML
                this.diagram.info.content = this.content.page.text.innerHTML;
                await _STO.SaveDiagram(this.diagram);
                _WIN.Draw();
            }
        });

        
        // this.display = true;
    }

    get display()
    {
        return this.background.style.display;
    }
    set display(flag)
    {
        this.background.style.display = (flag == true)? "block":"none";
    }

    Load(diagram)
    {
        this.diagram = diagram;

        this.title.page.Load(diagram.info.title);
        this.content.page.Load(diagram.info.content);

        this.cover.style.width = diagram.info.width + "px";
        this.cover.style.height = diagram.info.height + "px";

        // 세로길이, 폰트좀 달라서 크기가 안맞아. 자간 상하간 등도 차이남
        
    }

    async Delete()
    {
        if(!this.diagram) return;

        await _GRD.DeleteSquare(this.diagram.key);
        _WIN.Draw();

        this.display = false;
    }
}