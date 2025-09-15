import {_MOD, _CONFIG} from "/diagram/diagram.js"
import {_MAN, _WIN, _EDT} from "../main/main.js"

export class _MAIN
{
    constructor()
    {
        this.font = {
            color: "black", 
            fontSize: "48px", 
            textDecoration: "underline", // none
            fontStyle: "italic", // normal
            fontWeight: "bold" // normal
        };
        this.saveCaret = null;
    }

    async Init()
    {

        // 글자를 각각 따로주기 위해서 div 로 변경하자
        this.text = document.createElement("div");
        this.text.classList.add("text");
        this.text.setAttribute("contenteditable", "true");
        this.parentElement.appendChild(this.text);
        const editable = this.text;
        editable.innerHTML = "감<span style='color:red;'>사</span><span>합</span>니다 abcd<br><span style='color:white;font-size:48px;'>안녕12</span>3<br>반갑습니다.";

       
        editable.addEventListener("keydown", (e) => 
        {
            // 엔터로 줄바꿈 할경우 <div><br></div> 가 생겨서 
            // 쉬프트+엔터 눌렀을때 효과처럼 <br> 만 생기는 효과처럼 만들기    
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                
                const br = document.createElement("br");
                // const space = document.createTextNode("\u0020");
                const fragment = document.createDocumentFragment();
                fragment.appendChild(br);
                // fragment.appendChild(space);

                const sel = this.parentElement.getSelection();
                const range = sel.getRangeAt(0);

                range.deleteContents();
                range.insertNode(fragment);

                // range.setStart(space, 1);
                // range.collapse(false);

                range.setStart(br, 0);
                range.collapse(false);

                sel.removeAllRanges();
                sel.addRange(range);
            }
        });

        // 여기서 하면 안될듯. 캐럿을 기억해뒀다가 stylebox 에서 변경시 넣는걸로 하자
        // 그리고 빈공간 span 지워줘야되는데 안지워져
        editable.addEventListener("mouseup", (e) => 
        {
            const spanStyles = this.GetCaretChildSpanStyles();
            // console.log("결과", spanStyles);
            // 이제 fontbox에 쏘자.
            _EDT.font.page.Set(spanStyles);
        });

        editable.addEventListener("blur", e =>
        {
            const sel = this.parentElement.getSelection();
            if(sel.rangeCount) {
                this.saveCaret = sel.getRangeAt(0).cloneRange();
            }
            else {
                this.saveCaret = null;
            }
            // console.log("캐럿범위", this.saveCaret);
        });
        editable.addEventListener("focus", e =>
        {
            // 여기서 넣는게 맞을까 과연? 
            // 다짜고자 문장 드래그 해도 포커스일텐데
            // 아니나 다를까 잘못동작함.
            // B, I 버튼은 괜찮은데, 폰트사이즈, 컬러픽커에서만 조절해주면 될듯
            // if(this.saveCaret) {
            //     const sel = this.parentElement.getSelection();
            //     sel.removeAllRanges();
            //     sel.addRange(this.saveCaret);
            // }
        });
    }

    SetCaret()
    {
        console.log("오냐")
        this.text.focus();
        if(this.saveCaret) {
            const sel = this.parentElement.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.saveCaret);
        }
    }

    Load(info)
    {
        this.text.innerHTML = info.replace(/\n/g, "<br>");
    }

    // 캐럿 범위에 자식노드들 반환.(자식노드를 품는건 div 뿐)
    // 텍스트나 span 한부분만 캐럿했을경우, 
    //  현재 구조상 2뎁스 이상 없기때문에 자식이 없어서 {} 반환.
    GetCaretChildSpanStyles()
    {
        const list = {};
        const sel = this.parentElement.getSelection();
        if (!sel.rangeCount) return list;

        const range = sel.getRangeAt(0);
        const content = range.cloneContents();

        // 스타일 문자열을 객체로 변환하는 헬퍼
        function parseStyle(styleText) {
            if (!styleText) return;
            for (let item of styleText.split(";")) {
                if (!item) continue;
                const [key, val] = item.split(":");
                if (!key) continue;
                const camel = key.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());
                list[camel] = list[camel] ? "none" : val.trim();
            }
        }

        // 단일 노드일 경우
        if (range.startContainer === range.endContainer) {
            const parentNode = range.startContainer.parentNode;
            if (parentNode.tagName === "SPAN") {
                parseStyle(parentNode.getAttribute("style"));
            }
        } 
        // 여러 노드일 경우
        else {
            for (let child of content.childNodes) {
                if (child.tagName === "SPAN") {
                    parseStyle(child.getAttribute("style"));
                }
            }
        }

        return list;
    }

    GetCaretInfo()
    {
        const sel = this.parentElement.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const content = range.cloneContents();
        const save = {
            startDepth: (range.startContainer.tagName == "SPAN")? 2:1,
            spanNode: null,
            firstText: content.firstChild,
            lastText: content.lastChild,
            isEndSpan: (range.endContainer.parentNode.tagName == "SPAN")? true:false,
            isStartSpan: (range.startContainer.parentNode.tagName == "SPAN")? true:false,
            isSameParent: (range.endContainer.parentNode === range.startContainer.parentNode)? true:false
        };

        // console.log("좌측</span> 붙어야하나? ", save.isStartSpan);
        // console.log("우측<span> 붙여야하냐? ", save.isEndSpan);
        // console.log("부모 같니? ", range.endContainer.parentNode === range.startContainer.parentNode);
        
        // span 저장
        if(save.isEndSpan) save.spanNode = range.endContainer.parentNode;
        else if(save.isStartSpan) save.spanNode = range.startContainer.parentNode;
        return save;
    }

    SetCaret(node)
    {
        const range = document.createRange();
        const sel = this.parentElement.getSelection();

        range.selectNode(node);       // 노드 전체 선택 범위 생성
        sel.removeAllRanges();        // 기존 범위 모두 삭제
        sel.addRange(range);          // 새 범위 추가
    }

    StyleUp2(style) 
    {
        // 스타일 초기화
        style = style ?? this.font;
        const sel = this.parentElement.getSelection();
        if (!sel.rangeCount) return;

        // 캐럿에 대한 정보 가져오기 
        const caretInfo = this.GetCaretInfo();
        const range = sel.getRangeAt(0);

        // [분기]
        // 1. start랑 end가 같은 span의 자식일때(span 3분할)
        if(caretInfo.isSameParent && caretInfo.isStartSpan) 
        {
            console.log("1");
            this.#RangeSameSpan(caretInfo, range, style, sel);
            return;
        }
        // 5. start, end 모두 span일때
        if(!caretInfo.isSameParent && caretInfo.isStartSpan && caretInfo.isEndSpan) 
        {
            console.log("5");
            this.#RangeSpanSpan(caretInfo, range, style, sel);
            return;
        }
        // 4. start, end 모두 1뎁스 (span 밖)
        if(!caretInfo.isStartSpan && !caretInfo.isEndSpan) 
        {
            // 여기로 갔는데 span 안에 span 생성시켰다..
            // 재현은 엔터로 br생성하기 ->이때 span 첫 생성
            // 그다음 br중 가운데 클릭으로, 두번째 span 생성

            console.log("4");
            this.#RangeTextText(caretInfo, range, style, sel);
            return;
        }
        // 2. start가 span 자식, end가 1뎁스 (좌측 span 닫기)
        if(caretInfo.isStartSpan && !caretInfo.isEndSpan) 
        {
            console.log("2");
            this.#RangeSpanText(caretInfo, range, style, sel);
            return;
        }
        // 3. start 1뎁스, end가 span 자식 (우측 span 열기)
        if(!caretInfo.isStartSpan && caretInfo.isEndSpan) 
        {
            console.log("3");
            this.#RangeTextSpan(caretInfo, range, style, sel);
            return;
        }

    }
    #RangeTextSpan(caretInfo, range, style, sel)
    {
        // 3. start 1뎁스, end가 span 자식 (우측 span 열기)
        if(!caretInfo.isStartSpan && caretInfo.isEndSpan) 
        {
            // 1. start:텍스트 범위 복사
            const cloneStart = document.createTextNode(range.startContainer.textContent.slice(0, range.startOffset));
            
             // 2. middle:캐럿범위 복사
            const cloneMiddle = document.createElement("span");
            Object.assign(cloneMiddle.style, style); // 스타일 복사
            const content = range.cloneContents();

            // 중간에 span 이 수백개일 경우? or <br> or TEXT 일 경우?
            for(let child of content.childNodes)
            {
                if(child.tagName == "SPAN") {
                    for(let spanChild of child.childNodes) {
                        cloneMiddle.appendChild(spanChild.cloneNode(true));
                    }
                } 
                else {cloneMiddle.appendChild(child.cloneNode(true));}
            }
            if(cloneMiddle.innerHTML == ""){
                cloneMiddle.appendChild(document.createTextNode('\u200B')); // zero-width space
            }

            // 3. end:캐럿 이후 복사
            const cloneEnd = caretInfo.spanNode.cloneNode(false);
            cloneEnd.innerHTML = range.endContainer.textContent.slice(range.endOffset);

            // 4. 셔플
            const fragment = document.createDocumentFragment();
            if(cloneStart.innerHTML != "") fragment.appendChild(cloneStart);
            fragment.appendChild(cloneMiddle);
            if(cloneEnd.innerHTML != "") fragment.appendChild(cloneEnd);
            
            range.setStartBefore(range.startContainer);
            range.setEndAfter(range.endContainer);
            range.deleteContents();
            range.insertNode(fragment);

            // 5. 캐럿 범위지정
            const rangeCaret = document.createRange();
            if(cloneMiddle.innerHTML !== '\u200B') 
            {
                 rangeCaret.selectNodeContents(cloneMiddle);
            }
            else
            {   
                rangeCaret.setStart(cloneMiddle.firstChild, 1);
                rangeCaret.collapse(true);
            }
            sel.removeAllRanges(); // 기존 범위 모두 삭제
            sel.addRange(rangeCaret); // 새 범위 추가
            return;
        }
    }
    #RangeSpanText(caretInfo, range, style, sel)
    {
        // 2. start가 span 자식, end가 1뎁스 (좌측 span 닫기)
        if(caretInfo.isStartSpan && !caretInfo.isEndSpan) 
        {
            // 1. start:캐럿 시작 전까지 복사
            const cloneStart = caretInfo.spanNode.cloneNode(false);
            cloneStart.innerHTML = range.startContainer.textContent.slice(0, range.startOffset);

             // 2. middle:캐럿범위 복사
            const cloneMiddle = document.createElement("span");
            Object.assign(cloneMiddle.style, style); // 스타일 복사
            const content = range.cloneContents();

            // 중간에 span 이 수백개일 경우? or <br> or TEXT 일 경우?
            for(let child of content.childNodes)
            {
                if(child.tagName == "SPAN") {
                    for(let spanChild of child.childNodes) {
                        cloneMiddle.appendChild(spanChild.cloneNode(true));
                    }
                } 
                else {cloneMiddle.appendChild(child.cloneNode(true));}
            }
            if(cloneMiddle.innerHTML == ""){
                cloneMiddle.appendChild(document.createTextNode('\u200B')); // zero-width space
            }

            // 3: end:마지막 텍스트 복사
            const cloneEnd = document.createTextNode(range.endContainer.textContent.slice(range.endOffset));
            

            // 4. 셔플
            const fragment = document.createDocumentFragment();
            if(cloneStart.innerHTML != "") fragment.appendChild(cloneStart);
            fragment.appendChild(cloneMiddle);
            if(cloneEnd.innerHTML != "") fragment.appendChild(cloneEnd);
            
            range.setStartBefore(range.startContainer);
            range.setEndAfter(range.endContainer);
            range.deleteContents();
            range.insertNode(fragment);

            // 5. 캐럿 범위지정
            const rangeCaret = document.createRange();
            if(cloneMiddle.innerHTML !== '\u200B') 
            {
                 rangeCaret.selectNodeContents(cloneMiddle);
            }
            else
            {   
                rangeCaret.setStart(cloneMiddle.firstChild, 1);
                rangeCaret.collapse(true);
            }
            sel.removeAllRanges(); // 기존 범위 모두 삭제
            sel.addRange(rangeCaret); // 새 범위 추가
            return;
        }
    }
    #RangeTextText(caretInfo, range, style, sel)
    {
        if(!caretInfo.isStartSpan && !caretInfo.isEndSpan) 
        {
            // 2. middle:캐럿범위 복사
            const cloneMiddle = document.createElement("span");
            Object.assign(cloneMiddle.style, style); // 스타일 복사
            const content = range.extractContents();

            // 중간에 span 이 수백개일 경우? or <br> or TEXT 일 경우?
            for(let child of content.childNodes)
            {
                if(child.tagName == "SPAN") {
                    for(let spanChild of child.childNodes) {
                        cloneMiddle.appendChild(spanChild.cloneNode(true));
                    }
                } 
                else {cloneMiddle.appendChild(child.cloneNode(true));}
            }
            if(cloneMiddle.innerHTML == ""){
                cloneMiddle.appendChild(document.createTextNode('\u200B')); // zero-width space
            }

            range.insertNode(cloneMiddle);

            // 5. 캐럿 범위지정
            const rangeCaret = document.createRange();
            if(cloneMiddle.innerHTML !== '\u200B') 
            {
                 rangeCaret.selectNodeContents(cloneMiddle);
            }
            else
            {   
                rangeCaret.setStart(cloneMiddle.firstChild, 1);
                rangeCaret.collapse(true);
            }
            sel.removeAllRanges(); // 기존 범위 모두 삭제
            sel.addRange(rangeCaret); // 새 범위 추가
            return;
        }
    }

    #RangeSpanSpan(caretInfo, range, style, sel)
    {
        // 5. start, end 모두 span일때
        if(!caretInfo.isSameParent && caretInfo.isStartSpan && caretInfo.isEndSpan) 
        {
            // 1. start:캐럿 시작 전까지 복사
            const cloneStart = caretInfo.spanNode.cloneNode(false);
            cloneStart.innerHTML = range.startContainer.textContent.slice(0, range.startOffset);

             // 2. middle:캐럿범위 복사
            const cloneMiddle = document.createElement("span");
            Object.assign(cloneMiddle.style, style); // 스타일 복사
            const content = range.cloneContents();

            // 중간에 span 이 수백개일 경우? or <br> or TEXT 일 경우?
            for(let child of content.childNodes)
            {
                if(child.tagName == "SPAN") {
                    for(let spanChild of child.childNodes) {
                        cloneMiddle.appendChild(spanChild.cloneNode(true));
                    }
                } 
                else {cloneMiddle.appendChild(child.cloneNode(true));}
            }
            if(cloneMiddle.innerHTML == ""){
                cloneMiddle.appendChild(document.createTextNode('\u200B')); // zero-width space
            }

            // 3. end:캐럿 이후 복사
            const cloneEnd = caretInfo.spanNode.cloneNode(false);
            cloneEnd.innerHTML = range.endContainer.textContent.slice(range.endOffset);

            // 4. 셔플
            const fragment = document.createDocumentFragment();
            if(cloneStart.innerHTML != "") fragment.appendChild(cloneStart);
            fragment.appendChild(cloneMiddle);
            if(cloneEnd.innerHTML != "") fragment.appendChild(cloneEnd);
            
            range.setStartBefore(range.startContainer);
            range.setEndAfter(range.endContainer);
            range.deleteContents();
            range.insertNode(fragment);

            // 5. 캐럿 범위지정
            const rangeCaret = document.createRange();
            if(cloneMiddle.innerHTML !== '\u200B') 
            {
                 rangeCaret.selectNodeContents(cloneMiddle);
            }
            else
            {   
                rangeCaret.setStart(cloneMiddle.firstChild, 1);
                rangeCaret.collapse(true);
            }
            sel.removeAllRanges(); // 기존 범위 모두 삭제
            sel.addRange(rangeCaret); // 새 범위 추가
            return;
        }
    }

    #RangeSameSpan(caretInfo, range, style, sel)
    {
        if(caretInfo.isSameParent && caretInfo.isStartSpan) 
        {
            // 1. start:캐럿 시작 전까지 복사
            const cloneStart = caretInfo.spanNode.cloneNode(false);
            cloneStart.innerHTML = range.startContainer.textContent.slice(0, range.startOffset);

            // 2. middle:캐럿범위 복사
            const cloneMiddle = document.createElement("span");
            Object.assign(cloneMiddle.style, style); // 스타일 복사
            cloneMiddle.appendChild(range.cloneContents());
            if(cloneMiddle.innerHTML == ""){
                cloneMiddle.appendChild(document.createTextNode('\u200B')); // zero-width space
            }
       
            // 3. end:캐럿 이후 복사
            const cloneEnd = caretInfo.spanNode.cloneNode(false);
            cloneEnd.innerHTML = range.endContainer.textContent.slice(range.endOffset);
            
            // 4. 셔플
            const fragment = document.createDocumentFragment();
            if(cloneStart.innerHTML != "") fragment.appendChild(cloneStart);
            fragment.appendChild(cloneMiddle);
            if(cloneEnd.innerHTML != "") fragment.appendChild(cloneEnd);
            
            this.text.replaceChild(fragment, caretInfo.spanNode);

            // 5. 캐럿 범위지정
            const rangeCaret = document.createRange();
            if(cloneMiddle.innerHTML !== '\u200B') 
            {
                 rangeCaret.selectNodeContents(cloneMiddle);
            }
            else
            {   
                rangeCaret.setStart(cloneMiddle.firstChild, 1);
                rangeCaret.collapse(true);
            }
            sel.removeAllRanges(); // 기존 범위 모두 삭제
            sel.addRange(rangeCaret); // 새 범위 추가
        }
    }

    getCaretPos() 
    {
        const sel = this.parentElement.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const preRange = range.cloneRange();
        preRange.selectNodeContents(this.text);
        preRange.setEnd(range.startContainer, range.startOffset);
        const posFirstTemp = preRange.toString().length;
        // console.log("시작점", posFirstTemp)
        preRange.setEnd(range.endContainer, range.endOffset);
        const posLaistTemp = preRange.toString().length;
        // console.log("끝점", posLaistTemp, preRange)
      
        // console.log("에디터 전문: ", this.text.innerHTML);
        // const content = range.cloneContents();//
        const content = range.extractContents();
        
        // console.log("에디터 전문2: ", this.text.innerHTML);
        // console.log("짜른거: ", content);
        
        // 다행 extract 가 br은 가져가네. 빈 span만 전체 제거해주면 되겠다.

        // 빈 span 제거하는거해보자.
        
        const newSpan = document.createElement("span");
        newSpan.style = "color:white; font-size:22px;"
        newSpan.appendChild(content);
        
       
        newSpan.innerHTML = newSpan.innerHTML.replace(/<\/?span[^>]*>/g, "");

        //  console.log("생성스판", newSpan, newSpan.innerHTML);
         
        range.insertNode(newSpan);

        const matches = this.text.innerHTML.match(/<span[^>]*>\s*<\/span>/g, "");
        const cleaned = this.text.innerHTML.replace(/<span[^>]*>\s*<\/span>/g, "");
        // console.log("스판추출", cleaned, " 몇개?", matches.length);
          console.log("totle: ", range.startContainer, range.startOffset)
        this.text.innerHTML = cleaned;
        // this.SetRange(0,1,1,3);

        // **************while 돌면서 range 찾아서 (노드찾기)
        
        // this.SetRange(1,0, 1,3)
        
    }

        

    // 캐럿범위를 통합해보자
    StyleUp1(styleObject)
    {
        const sel = this.parentElement.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const endNode = range.endContainer;
        const content = range.cloneContents();   // 원본 유지
        let node = range.startContainer;

        const save = {
            startDepth: (node.parentNode.tagName == "SPAN")? 2:1,
            spanNode: null,
            firstText: content.firstChild,
            lastText: content.lastChild,
            isEndSpan: (range.endContainer.parentNode.tagName == "SPAN")? true:false,
            isStartSpan: (node.parentNode.tagName == "SPAN")? true:false,
        };
        
        let count = 0;
        while(node) 
        {
            const parentTag = node.parentNode?.tagName;

            if(node.tagName === "SPAN"){
                // 스판 저장.
                save.spanNode = node;
            }
            else if(parentTag === "DIV"){
                // 1뎁스다
            }
            else if(parentTag === "SPAN"){
                // 2뎁스다.
                save.spanNode = node.parentNode;
            }
            console.log(count++, parentTag, node);
            if(node === save.lastText) {console.log("응?")}
            if(node === endNode || parentTag == null) {
                console.log("마지막 노드다: ", parentTag, node, save.lastText);
                // if(parentTag === "SPAN") {save.isLastSpan = true}
                break;
            }
            
            // 다음 노드로 이동 
            if (node.nextSibling) {
                // 형제 노드 우선
                node = node.nextSibling;
            } else {
                // 형제 노드 없으면 부모로 올라가서 다음 형제 찾기
                while (node && !node.nextSibling) {
                    node = node.parentNode;
                }
                if (node) {
                    
                    node = node.nextSibling;
                }
                console.log("여가역", node)
            }
        }

        console.log("좌측</span> 붙어야하나? ", save.isStartSpan);
        console.log("우측<span> 붙여야하냐? ", save.isEndSpan);
        // 순회하면서 span종류를 수집할꺼야. 
        // 수집후에 



    }

    // 캐럿 주기
    SetRange(start, startOffset, end, endOffset)
    {
        const editor = this.text;
        const startNode = editor.childNodes[start];
        const endNode = editor.childNodes[end];

        for(let i=0; i<editor.childNodes.length; i++)
        {
            const node = editor.childNodes[i];
            // console.log(node);
        }

        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        const selection = this.parentElement.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }


    FlattenSpans(root) 
    {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
            acceptNode(node) {
                return node.tagName === "SPAN" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });

        const spans = [];

        let node;
        while ((node = walker.nextNode())) {
            spans.push(node);
        }

        spans.reverse().forEach(span => {
            while (span.firstChild && span.firstChild.nodeType === Node.ELEMENT_NODE && span.firstChild.tagName === "SPAN") {
                const inner = span.firstChild;

                // style 병합
                Object.assign(inner.style, span.style);

                // unwrap outer span
                span.parentNode.insertBefore(inner, span);
                span.remove();
            }
        });
    }

    WrapSelectedTextInSpanSafe4(styleObj = {}) {
        const sel = this.parentElement.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);

        if (range.collapsed) {
            // 빈 선택(캐럿만 있을 경우)
            const span = document.createElement("span");
            Object.assign(span.style, styleObj);
            span.appendChild(document.createTextNode("\u200B")); // zero-width space
            range.insertNode(span);

            // 커서 이동
            const newRange = document.createRange();
            newRange.setStart(span.firstChild, 1);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
            return;
        }

        // 선택된 영역이 있을 경우
        const content = range.extractContents();

        // 텍스트 노드 + span 노드만 처리 (2뎁스 구조 유지)
        const newContent = document.createDocumentFragment();

        content.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const span = document.createElement("span");
                Object.assign(span.style, styleObj);
                span.textContent = node.textContent;
                newContent.appendChild(span);
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SPAN") {
                // span 안에 span이 겹치지 않도록 기존 스타일과 병합
                const mergedSpan = document.createElement("span");
                Object.assign(mergedSpan.style, node.style, styleObj);

                node.childNodes.forEach(child => {
                    mergedSpan.appendChild(child.cloneNode(true));
                });

                newContent.appendChild(mergedSpan);
            } else {
                newContent.appendChild(node); // <br> 등은 그대로 유지
            }
        });

        // 기존 선택 영역 삭제
        range.deleteContents();

        // 새 노드들 삽입 및 커서 위치 갱신
        let lastInsertedNode = null;
        Array.from(newContent.childNodes).forEach(node => {
            range.insertNode(node);
            lastInsertedNode = node;
            range.setStartAfter(lastInsertedNode);
            range.collapse(true);
        });

        // 선택 범위 재설정
        sel.removeAllRanges();
        const newRange = document.createRange();
        if (lastInsertedNode) {
            newRange.setStartBefore(lastInsertedNode);
            newRange.setEndAfter(lastInsertedNode);
        } else {
            // 안전하게, 예외 케이스 처리
            newRange.setStart(range.startContainer, range.startOffset);
            newRange.collapse(true);
        }
        sel.addRange(newRange);

        // span 병합 처리
        this.FlattenSpans(this.parentElement);
    }

    WrapSelectedTextInSpan2(styleObj = {}) {
        const sel = this.parentElement.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const span = document.createElement("span");
        Object.assign(span.style, styleObj);

        if (range.collapsed) {
            // 빈 span 생성 & zero-width space 삽입
            span.appendChild(document.createTextNode("\u200B"));
            range.insertNode(span);

            // 커서를 zero-width space 뒤에 위치시키기
            const newRange = document.createRange();
            newRange.setStart(span.firstChild, 1);
            newRange.collapse(true);

            sel.removeAllRanges();
            sel.addRange(newRange);
        } else {
            // 선택 영역을 span으로 감싸기
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);

            // 선택 영역 재설정
            sel.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            sel.addRange(newRange);
        }
    }

    WrapSelectedTextInSpan(styleObj = {}) 
    {
        const selection = this.parentElement.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        // 1. 선택된 내용 추출
        const content = range.extractContents();

        // 2. 중첩 <span> 제거 및 스타일 병합
        function flattenSpans(node) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
                const span = node;
                const parent = span.parentNode;
                const fragment = document.createDocumentFragment();

                while (span.firstChild) {
                    let child = span.firstChild;
                    span.removeChild(child);
                    fragment.appendChild(child);
                }

                flattenSpans(fragment); // 재귀 처리
                return fragment;
            } else if (node.hasChildNodes()) {
                const children = Array.from(node.childNodes);
                children.forEach(child => {
                    const replaced = flattenSpans(child);
                    if (replaced && replaced !== child) {
                        node.replaceChild(replaced, child);
                    }
                });
            }
            return node;
        }

        const cleanContent = flattenSpans(content);

        // 3. 새 span 생성 및 스타일 적용
        const newSpan = document.createElement('span');

        // styleObj를 문자열로 변환해서 style 속성에 설정
        for (let key in styleObj) {
            newSpan.style[key] = styleObj[key];
        }

        newSpan.appendChild(cleanContent);

        // 4. 다시 삽입
        range.insertNode(newSpan);

        // 선택 해제
        selection.removeAllRanges();
    }
}