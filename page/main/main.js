import {_MOD, _CONFIG} from "../../diagram/diagram.js"
import {_CAPTURE} from "../editor/transcanvas.js"

export let _MAN, _STO, _MEU, _WIN, _IFO, _GRD, _SETTING, _EDT, _CAP, _FVO, _PTT;


export class _MAIN
{
    constructor()
    {
    }

    async Init()
    {
        _MAN = this;
        const page = _CONFIG.dir.page;

        // 저장소 페이지 호출
        _STO = await _MOD.script.create(page + "/storage.js");

        // 그리드 페이지 호출
        _GRD = await _MOD.script.create(page + "/grid.js");
        
        // 메뉴 페이지 호출
        this.menu = await _MOD.panel.create(page + "/menu/menu", this.parentElement);
        this.menu.panel.classList.add("menu");
        _MEU = this.menu.page;

        // 윈도우 호출
        this.window = await _MOD.panel.create(page + "/window/window", this.parentElement);
        this.window.panel.classList.add("window");
        _WIN = this.window.page;

        // 컨트롤러 호출
        this.controller = await _MOD.script.create(page + "/window/controller.js");

        // 캡처
        _CAP = new _CAPTURE();

        // 저장소에서 정보 가져오기
        _SETTING = await _STO.InitSetting();
        
        // 텍스트창 호출
        this.editor = await _MOD.panel.create(page + "/editor/editor", this.parentElement);
        this.editor.panel.classList.add("editor");
        _EDT = this.editor.page;

        // 팔레트창 호출
        this.palette = await _MOD.panel.create(page + "/palette/palette", this.parentElement);
        this.palette.panel.classList.add("palette");
        _PTT = this.palette.page;

        // 즐겨찾기창 호출
        this.favorite = await _MOD.panel.create(page + "/favorite/favorite", this.parentElement);
        this.favorite.panel.classList.add("favorite");
        _FVO = this.favorite.page;

        // 맵 로드
        await this.Load(_SETTING.space);
    }   

    async Load(key)
    {
        if(!key) {return;}

        // 1. 타일정보 _GRD 에 로드(초기화)
        await _GRD.Load(key);
        
        // 2. _WIN 에 Draw() 요청 (_WIN 은 상자정보를 _GRD 에서 읽는다.)
        await _WIN.Draw();
    
        // 3. favorite 로드
        await _FVO.Load();
    }
}

