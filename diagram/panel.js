import {_CONFIG} from "/diagram/diagram.js"

export default class _DIAGRAM_PANEL
{
    constructor()
    {
        this.parentElement; // 부모 엘리먼트
        this.panel; // 외부에서 조작할 div
        this.shadow; // 페이지에 보낼 엘리먼트
        this.page; // 페이지 _MAIN 객체를 담을 변수
    }

    static async create(src, parentElement, data)
    {
        // panel 객체생성
        const {_MAIN: main} = await import(src + ".js");
        const instance = new _DIAGRAM_PANEL();

        // panel 생성
        instance.panel = document.createElement("div");
        instance.panel.classList.add("_diagram_panel");
        if(parentElement == null) {parentElement = document.body;}
        instance.parentElement = parentElement;
        parentElement.appendChild(instance.panel);

        // Shadow Dom 생성
        instance.shadow = instance.panel.attachShadow({mode: "open"});

        // Shadow Dom에 공통 css 파일 추가
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = _CONFIG.dir.diagram + "/panel.css";
        instance.shadow.appendChild(link);

        // page 호출
        instance.page = new main();
        instance.page.parentElement = instance.shadow;
        await instance.page.Init(data);

        // 사용자 css파일 후순위 로드
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = src + ".css";
        instance.shadow.appendChild(style);

        // 생성된 객체 전달
        return instance;
    }
}