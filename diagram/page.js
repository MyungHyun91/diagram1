
export default class _DIAGRAM_PAGE
{
    constructor()
    {
        this.parentElement; // 부모 엘리먼트
        this.shadow; // 페이지에 보낼 엘리먼트
        this.page; // 페이지 _MAIN 객체를 담을 변수
    }

    static async create(src, parentElement, data)
    {
      
        // 객체생성
        const {_MAIN: main} = await import(src + ".js");
        const instance = new _DIAGRAM_PAGE();

        // 부모변수 초기화
        if(parentElement == null) {parentElement = document.body;}
        instance.parentElement = parentElement;

        // Shadow Dom 생성
        instance.shadow = parentElement.attachShadow({mode: "open"});

        // css 파일 지역화
        const style = document.createElement("link");
        style.rel = "stylesheet";
        style.type = "text/css";
        style.href = src + ".css";
        instance.shadow.appendChild(style);
        
        // page 호출
        instance.page = new main();
        instance.page.parentElement = instance.shadow;
        await instance.page.Init(data);
        
        // 생성된 객체 전달
        return instance;
    }
}