
import {_MOD, _CONFIG} from "../diagram/diagram.js"
import {_GRD} from "./main/main.js"

export class _MAIN
{
    constructor()
    {
    }

    async Init()
    {
        // 디비생성
        this.db = await _MOD.indexeddb.create(_CONFIG.dir.page + "/db_table.json");


    }

    // 환경변수 및 space 초기화
    async InitSetting()
    {
        // 1. 환경변수 조회
        let select = await this.db.Select("setting", 1);
        
        // 2. 없으면 새로 생성
        if(!select) 
        {
            await this.db.Insert("setting", {space: "super", _key:1});
            select = await this.db.Select("setting", 1);
        }
        // 3. 있는데 space가 null 이면 "super" 로 입력
        else if(!select.space == null)
        {
            await this.db.Update("setting", {space: "super"});
            select = await this.db.Select("setting", 1);
        }

        // 4. space 없으면 새로 생성
        let selectSpace = await this.db.Select("space", "super");
        if(!selectSpace)
        {
            await this.db.Insert("space", {"key": "super", "list": [], 
                "parent": null, "timestamp": _MOD.GetCurrentDateTime()});
        }

        return select;
    }

    // 환경설정 (1개 행만 존재)
    async SelectSetting()
    {
        return await this.db.Select("setting", 1);
    }

    async UpdateSetting(info)
    {
        await this.db.Update("setting", info);
    }
    
    // SPACE (read, write)
    async LoadSpace(key, parent)
    {
        let selectSpace = await this.db.Select("space", key);
        // space 없으면 새로 생성
        if(!selectSpace)
        {
            await this.db.Insert("space", {"key": key, "list": [], 
                "parent": parent, "timestamp": _MOD.GetCurrentDateTime()});
            selectSpace = await this.db.Select("space", key);
        }

        // 셋팅 수정
        await this.db.Update("setting", {space: key, _key: 1});
       

        return selectSpace;
    }
    async LoadParentSpace(key)
    {
        const selectSpace = await this.db.Select("space", key);
        // space 없으면 리턴
        if(!selectSpace) return null;
        const parent = selectSpace.parent??"super"; // 최상위일 경우 null 이라 자기자신 호출
        const selectParentSpace = await this.db.Select("space", parent);
        
        // 셋팅 수정
        await this.db.Update("setting", {space: selectParentSpace.key, _key: 1});

        return selectParentSpace;
    }

    async SelectSpace(key)
    {
        return await this.db.Select("space", key);
    }

    async InsertSpace(info)
    {
        await this.db.Insert("space", info);
    }

    async UpdateSpace(info)
    {
        await this.db.Update("space", info);
    }

    async DeleteSpace(info)
    {
        await this.db.Delete("space", info.key);
    }
    
    async SelectDiagram(key)
    {
        return await this.db.Select("diagram", key);
    }

    // load - 조회
    // save - 저장(insert, update)
    // delete - 삭제
    // 타입(space, diagram(square, rhombus, class, function), line(default, color, dotted, arrow)
    async SaveDiagram(diagram)
    {
        if(diagram.key)
        {   
            await this.db.Update("diagram", {key: diagram.key, info:diagram.info});
        }
        else
        {
            diagram.key = _MOD.MakeKey();
            await this.db.Insert("diagram", 
                {key: diagram.key, type: diagram.type, info:diagram.info, timestamp:_MOD.GetCurrentDateTime()});
            
            // space 리스트에 등록하기
            const selectSpace = await this.db.Select("space", _GRD.spaceKey);
            selectSpace.list.push(diagram.key);
            await this.db.Update("space", selectSpace);
        }
    }

    async DeleteDiagram(key)
    {
        if(!key) return;
        
        await this.db.Delete("diagram", key);

        // space 리스트에서 삭제하기
        const selectSpace = await this.db.Select("space", _GRD.spaceKey);
        
        for(let i=0; i<selectSpace.list.length; i++)
        {
            if(selectSpace.list[i] == key)
            {
                selectSpace.list.splice(i, 1);
                break;
            }
        }
        await this.db.Update("space", selectSpace);
    }
}   
