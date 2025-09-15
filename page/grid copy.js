
import {_MOD, _CONFIG} from "/diagram/diagram.js"
import {_STO} from "./main/main.js"

export class _MAIN
{
    constructor()
    {
        this.grid = {width: 500, height: 500};
        this.map = new Map(); // key: x_y, value: []
        this.select = [];
        this._space_key = null;
    }

    async Init(){}

    async Load(key)
    {
        // 맵 초기화
        this.map.clear();
        
        // 맵정보 가져오기
        const select = await _STO.SelectSpace(key);
        
        this._space_key = select.key;
        // 상자정보 저장 (키 모양: "x_y")
        const list = select?.list;
        
        if(Array.isArray(list))
        {
            for(const squareKey of list)
            {
                const squareInfo = await _STO.SelectSquare(squareKey);
                if(!squareInfo) {continue;}
                await this.Insert(squareInfo);
            };
        }
        
    }

    GetMapKey(spaceX, spaceY)
    {
        const x = spaceX - spaceX%this.grid.width;
        const y = spaceY - spaceY%this.grid.height;
        return x + "_" + y;
    }

    GetList()
    {
        const values = Array.from(this.map.values());
        const list = values.reduce((temp, arr) =>
        {
            temp.push(...arr);
            return temp;
        }, [])
        return list;
    }

    GetChecked()
    {
        const list = this.GetList();
        return list.reduce((arr, square) =>
        {
            if(square.checked) arr.push(square);
            return arr;
        }, []);
    }

    Find(spaceX, spaceY)
    {
        const arr = this.GetList();
        // 상자 겹치면 z-index 높은걸로 반환
        const square = arr.reduceRight((topMost, obj) =>
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


    async MoveMap(info)
    {
        // 이동할 mapkey
        const mapKeyNew = this.GetMapKey(info.x, info.y);

        // 1. 현재 맵의 어디key에 속했느지 확인
        for(const [mapkey, value] of this.map)
        {
            
            for(let i=0; i<value.length; i++)
            {
                const square = value[i];
                if(square.key != info.key) continue;

                
                // 2. 찾았다. 옮길key랑 다르면 옮기기 시작
                if(mapkey != mapKeyNew)
                {
                    // 3. 옮길 key 배열에서 제거
                    value.splice(i, 1);

                    // 4. 새로운 map key에 저장
                    if(!this.map.has(mapKeyNew)){
                        this.map.set(mapKeyNew, []);
                    }
                    const arr = this.map.get(mapKeyNew);
                    arr.push(square);
                    let a1 = this.GetList();
                    let b1 = [];
                    for(let item of a1)
                    {
                        if(item.key == info.key) b1.push(item);
                    }
                    // console.log("옮겼다", b1, mapKeyNew);
                }
                return;
            }
        };
    }

    // 0:첫번째로, -1:마지막으로
    ListMove(findKey, number)
    {
        this.map.forEach((value, key) => 
        {    
            for(let i=0; i<value.length; i++)
            {
                if(value[i].key == findKey) 
                {
                    const item = value.splice(i, 1)[0];
                    const toIntex = (number==-1)?value.length:number;
                    value.splice(toIntex, 0, item);
                    return;
                }
            }
        });
    }

    // 상자객체 찾기
    Select(key)
    {
        const list = this.GetList();
        for(const square of list)
        {
            if(square.key == key) return square;
        }
        return null;
    }
    

    async Insert(info)
    {
        const square = await _MOD.script.create(_CONFIG.dir.page + "/window/square.js", info);
        const key = this.GetMapKey(square.x, square.y)
        
        // 키 없으면 생성
        if(!this.map.has(key)){
            this.map.set(key, []);
        }
        const arr = this.map.get(key);
        arr.push(square);
    }

    /**
     * 상자정보 info값대로 수정
     * @param {info} info 정보페이지 Output()
     */
    async Update(info)
    {
        // 1. 없으면 리턴
        const square = this.Select(info.key);
        if(!square) return;

        // 2. 정보
        await square.Init(info);

        // 3. 좌표이동(필요하면)
        await this.MoveMap(info);
    }
    
    /**
     * 상자삭제
     * @param {info} info 정보페이지 Output()
     */
    async Delete(info)
    {
        // 이동할 mapkey
        const mapkey = this.GetMapKey(info.x, info.y);
        const arr = this.map.get(mapkey);
        if(!arr) return;
        console.log("삭제정보", mapkey, info)
        
        for(let i=0; i<arr.length; i++)
        {
            const square = arr[i];
            if(square.key == info.key)
            {
                // 3. 배열에서 제거
                arr.splice(i, 1);    
                if(arr.length === 0)
                {
                    this.map.delete(mapkey);
                }
                return;
            }
        }
    }
}