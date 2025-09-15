
import {_MOD, _CONFIG} from "/diagram/diagram.js"
import {_STO, _SETTING} from "./main/main.js"

export class _MAIN
{
    constructor()
    {
        this.spaceKey = null;
        this.square = [];
        this.line = [];
    }
    async Init(){}

    async Load(key)
    {
        // 맵정보 가져오기
        const selectSetting = await _STO.SelectSetting();
        const select = await _STO.LoadSpace(key, selectSetting.space);

        // 맵 초기화
        this.spaceKey = select.key;
        this.square = [];
        this.line = [];   
        
        // 상자정보 저장
        const list = select?.list;
        
        if(Array.isArray(list))
        {
            // 상자 로드
            for(const diagramKey of list)
            {
                const select = await _STO.SelectDiagram(diagramKey);
                if(!select || select.type != "memo") {continue;}
                await this.Add(select.key, select.type, select.info);
            };

            // 라인 로드
            for(const diagramKey of list)
            {
                const select = await _STO.SelectDiagram(diagramKey);
                if(!select || select.type != "line") {continue;}
                await this.Add(select.key, select.type, select.info);
            };
        }
        
    }

    // 객체 찾기
    FindToKey(key)
    {
        for(const square of this.square)
        {
            if(square.key == key) return square;
        }
        return null;
    }
    FindToPos(spaceX, spaceY)
    {
        // 상자 겹치면 z-index 높은걸로 반환
        const square = this.square.reduceRight((topMost, obj) =>
        {
            const contains = (
                obj.x <= spaceX &&
                obj.x + obj.width >= spaceX &&
                obj.y <= spaceY &&
                obj.y + obj.height >= spaceY
            );
            if(!contains) return topMost;
            if(!topMost || obj.z > topMost.z) return obj;
            return topMost;
        }, null);
        return square;
    }
      
    /**
     * 상자에 연결된 라인찾기
     * @param {diagram.key} squareKey 상자 key
     */
    GetLinkedLine(squareKey)
    {
        const lines = [];
        for(let i=0; i<this.line.length; i++)
        {
            if(this.line[i].info.squareKey1 == squareKey ||
                this.line[i].info.squareKey2 == squareKey)
            {
                lines.push(this.line[i]);
            }
        }
        return lines;
    }

    // 0:첫번째로, -1:마지막으로
    MoveItemSequence(findKey, number)
    {
        for(let i=0; i<this.square.length; i++)
        {
            if(this.square[i].key == findKey) 
            {
                const item = this.square.splice(i, 1)[0];
                const toIntex = (number==-1)?this.square.length:number;
                this.square.splice(toIntex, 0, item);
                return;
            }
        }
    }
    
    async Add(key, type, info)
    {
        let diagram = null;
        switch(type)
        {
            case "memo":
                diagram = await _MOD.script.create(_CONFIG.dir.page + "/diagram/memo.js");
                diagram.Load(key, info);
                this.square.push(diagram);
                // key 없으면 생성
                if(!key)
                {
                    await _STO.SaveDiagram(diagram);
                }
                break;
            case "line":
                diagram = await _MOD.script.create(_CONFIG.dir.page + "/diagram/line.js");
                diagram.Load(key, info);
                this.line.push(diagram);
                // key 없으면 생성
                if(!key)
                {
                    await _STO.SaveDiagram(diagram);
                }
                break;
        }
        return diagram;
    }
    
    /**
     * 상자삭제
     * @param {diagram.key} key 상자 key
     */
    async DeleteSquare(key)
    {   
        for(let i=0; i<this.square.length; i++)
        {
            if(this.square[i].key == key)
            {
                // 1. 라인들 조회
                const lines = this.GetLinkedLine(key);
                
                // 2. 라인삭제
                for(let i=0; i<lines.length; i++) 
                {
                    await this.DeleteLine(lines[i].key);
                };
                
                // 3. db-> diagram, space 에서 상자 삭제
                await _STO.DeleteDiagram(key);

                // 4. 배열에서 제거
                this.square.splice(i, 1);
                return;
            }
        }
    }

    /**
     * 라인삭제
     * @param {diagram.key} key 상자 key
     */
    async DeleteLine(key)
    {   
        for(let i=0; i<this.line.length; i++)
        {
            if(this.line[i].key == key)
            {
                // db-> diagram, space 에서 라인 삭제
                await _STO.DeleteDiagram(key);
                // 배열에서 제거
                this.line.splice(i, 1);
                return;
            }
        }
    }

    async SpaceOut()
    {
        if(this.spaceKey == "super") {
            return;
        }

        // 부모 space 못찾을시 => 'super' 로 접속하기
        const select = await _STO.LoadParentSpace(this.spaceKey);

        // 맵 초기화
        await this.Load(select.key);
    }
}