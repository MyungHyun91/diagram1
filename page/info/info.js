
import {_MOD, _CONFIG} from "/diagram/diagram.js"
import {_MAN, _WIN} from "../main/main.js"

export class _MAIN
{
    constructor()
    {
        this.input = [
            {key:"key", type:"text"},
            {key:"title", type:"text"},
            {key:"x", type:"number"},
            {key:"y", type:"number"},
            {key:"z", type:"number"},
            {key:"width", type:"number"},
            {key:"height", type:"number"},
            {key:"memo", type:"textarea"},
            {key:"link", type:"array"},
        ];
    }

    async Init()
    {
        // 상자의 타입(class, function, memo 등등)
        this.icon = _MOD.element.create("a", this.parentElement);
        this.icon.classList.add("icon");
        this.icon.innerText = "class";

        // 상단탭 닫기버튼
        const close = await _MOD.button.create("/resource/icon/cancel.png", ["tab_button"], this.parentElement);
        close.addEventListener("click", (e) =>
        {
            _MAN.UncheckAll();
            _WIN.Draw();
        });

        _MOD.element.create("br", this.parentElement);
        

        // 상자 입력정보
        this.input.forEach((obj) =>
        {
            if(obj.key == "memo") return;
            if(obj.key == "link") return;
            this.AddInput(obj.key, obj.type, this.parentElement);
        });
        
        // 메모
        const field1 = _MOD.element.create("fieldset", this.parentElement);
        const title1 = _MOD.element.create("legend", field1);
        title1.innerText = "메모";
        this.memo = _MOD.element.create("textarea", field1);
    
        // 다른 상자와 연결정보
        const field2 = _MOD.element.create("fieldset", this.parentElement);
        const title2 = _MOD.element.create("legend", field2);
        title2.innerText = "연결정보";
        this.chain = _CHAIN_LIST.create(field2);
        
        // 상자 삭제버튼
        
        this.save =  await _MOD.button.create("/resource/icon/save2.png", ["button"], this.parentElement);
        this.remove =  await _MOD.button.create("/resource/icon/trash_default.png", ["button"], this.parentElement);
        this.save.addEventListener("click", (e) =>
        {
            const output = this.Output();
            // console.log("저장정보", output);
            _MAN.Update(output);
        });
        this.remove.addEventListener("click", (e) =>
        {
            const conf = confirm("삭제하시겠습니까?");
            if(conf)
            {
                const output = this.Output();
                // console.log("삭제정보", output);
                _MAN.Delete(output);
            }
        });
    }

    Move(x, y)
    {
        this.x.value = parseInt(this.x.value) + x;
        this.y.value = parseInt(this.y.value) + y;
    }

    /**
     * 파라미터로 받은 상자정보를 입력한다.
     * @param {/window/square} square 상자객체
     */
    Input(square)
    {
        if(!square) square = {};
        this.input.forEach(obj =>
        {
            if(obj.key == "link"){
                this.chain.Input(square[obj.key] ?? null);
            }
            else{
                this[obj.key].value = square[obj.key] ?? null;
            }
        });
    }

    Output()
    {
        const info = this.input.reduce((save, input) =>
        {
            if(input.key == "link"){
                save[input.key] = this.chain.Output();
            }
            else {
                save[input.key] = this[input.key].value;
            } 
            return save;
        }, {});
        return info;
    }

    // 입력정보 한 줄 생성
    AddInput(id, type, parentElement)
    {
        parentElement = parentElement||this.parentElement;

        // 명칭이랑 같이 받자
        const label = _MOD.element.create("label", parentElement);
        label.innerHTML = id;

        const input = _MOD.element.create("input", parentElement);
        input.type = type;
        input.id = id;
        input.placeholder = "";
        input.autocomplete = "off";
        this[id] = input;

        _MOD.element.create("br", parentElement);
        return input;
    }

    Square(info)
    {
        // 연결된 라인 여러개
        // 라인목록 클릭하면 해당 라인 중심으로 도형 두개 보여줌
        // 화면 밖으로 나갔으면 줌 멀리해서 보여주게끔
    }

    Line(info)
    {
        // 연결된 도형 두개(2개밖에 경우가 없지)
        // 도형목록 클릭하면 해당 도형으로 포커스 이동
    }
}

class _CHAIN_LIST
{
    constructor()
    {
    }

    async Init(parentElement)
    {   
        this.parentElement = parentElement;
        this.div = _MOD.element.create("div", parentElement);
        this.div.classList.add("chain_cover");
        this.list = [];
        this.Add();
        this.Add();
        this.Add();
        this.Add();
        this.Add();
    }

    async Add()
    {
        const div = _MOD.element.create("div", this.div);
        div.classList.add("chain");

        // 1. 연결선 (빨간 화살 점선, 기본선, 선색상, 두줄, 세줄);

        // 2. 연결상자 네임

        // 3. hover, click() 하면 연결선 불들어오게

        // 4. 즐겨찾기처럼 팝업창 생성가능.
        // 팝업창은 하단에 탭처럼 쌓이고, 자물쇠 걸 수 있고,
        // 라고 할줄 알았냐? 인포를 팝업으로 만들고 쌓이게 해야할듯
        
    }

    Input(info)
    {
        // 기존에 있던거 초기화를 어디서하지
        // console.log(info)
    }

    Output()
    {
        return [];
    }

    static create(parentElement)
    {
        const instance = new _CHAIN_LIST();
        instance.Init(parentElement);
        return instance;
    }
}

class _SQUARE
{
    constructor()
    {

    }
}

class _LINE
{
    constructor()
    {
        // 라인종류: 화살표, 평등선, 평등점선, 또 뭐있을까
        
    }
}