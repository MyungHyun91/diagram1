import {_MOD} from "/diagram/diagram.js"
export let _MAN, _STO, _MEU, _WIN, _IFO, _GRD, _SETTING, _EDT;

export class _MAIN
{
    constructor()
    {
    }

    async Init()
    {
        _MAN = this;

        // 저장소 페이지 호출
        _STO = await _MOD.script.create("/page/storage.js");

        // 그리드 페이지 호출
        _GRD = await _MOD.script.create("/page/grid.js");
        
        // 메뉴 페이지 호출
        this.menu = await _MOD.panel.create("/page/menu/menu", this.parentElement);
        this.menu.panel.classList.add("menu");
        _MEU = this.menu.page;

        // 윈도우 호출
        this.window = await _MOD.panel.create("/page/window/window", this.parentElement);
        this.window.panel.classList.add("window");
        _WIN = this.window.page;

        // 정보 페이지 호출
        this.info = await _MOD.panel.create("/page/info/info", this.parentElement);
        this.info.panel.classList.add("info");
        this.info.panel.classList.add("hide");
        _IFO = this.info.page;

        // 저장소에서 정보 가져오기
        _SETTING = await _STO.InitSetting();
        
        // 텍스트창 호출
        this.editor = await _MOD.panel.create("/page/editor/editor", this.parentElement);
        this.editor.panel.classList.add("editor");
        _EDT = this.editor.page;

        // 맵 로드
        this.Load(_SETTING.space);
    }   

    async Load(key)
    {
        if(!key) {return;}

        // 1. 타일정보 _GRD 에 로드(초기화)
        await _GRD.Load(key);
        
        // 2. _WIN 에 Draw() 요청 (_WIN 은 상자정보를 _GRD 에서 읽는다.)
        await _WIN.Draw();
    
    }
}

