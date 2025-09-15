
export default class _DIAGRAM_SCRIPT
{
    constructor()
    {
        this.page; // 페이지 _MAIN 객체를 담을 변수
    }

    async Init()
    {
    }

    static async create(src, data)
    {
        // 객체 생성
        const {_MAIN: main} = await import(src);
        const instance = new _DIAGRAM_SCRIPT();

        // 객체 초기화
        await instance.Init();

        // page 호출
        instance.page = new main();
        await instance.page.Init(data);

        // 생성된 객체 전달
        return instance.page;
    }
}