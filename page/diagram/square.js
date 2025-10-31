import {_AXIS} from "../axis.js"
import {_CAP, _EDT} from "../main/main.js"
import {TransHtmlToCanvas} from "../editor/transcode.js"

export class _MAIN extends _AXIS
{
    constructor()
    {
        super();
        this.type = "square";
        this.checked = false;
        this.isDrag = true;
        this.info = {
            text: "", backgroundColor: null
        };
        this.textHeight = 0;
    }
    
    Load(info)
    {
        this.key = info.key??this.key;
        for(let name in info)
        {
            if(!info[name]) continue;
            this.info[name] = info[name];
        }
        
        // resize
        this.x = info.x??this.x;
        this.y = info.y??this.y;
        this.width = info.width??this.width;
        this.height = info.height??this.height;

        // transcode
        if(this.info.text)
        {
            this.transcode = TransHtmlToCanvas(this.info.text);
            // this.textHeight = this.GetTextHeight();
        }
        this.Draw();
    }

    Draw(gapX=0, gapY=0, gapWidth=0, gapHeight=0)
    {
        // 캡처 사이즈 초기화
        this.cav.width = this.width;
        this.cav.height = this.height;

        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = this.info.backgroundColor ?? "black";
        this.ctx.fillRect(gapX, gapY, this.width-gapWidth, this.height-gapHeight);
        
        if(this.info.text)
        {
            this.DrawText();
        }

        this.DrawChildren();
    }

    GetTextHeight()
    {
        if(!this.transcode) return;

        // 메모 작성                
        this.ctx.font = 18 + "px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "left"; // 수평 가운데 정렬
        // _WIN.ctx.textBaseline = "middle"; // 수직 가운데 정렬

        // trans 적용
        const trans = this.transcode;
        const paddingWidth = 20;
        const lineHeightGap = 1.7; // 1.7은 테스트하며 맞춘수치
        let lineY = 0;
        let lineX = paddingWidth;
        let lineHeight = 0;
        const lines = [];

        for(let i=0; i<trans.length; i++)
        {
            let t = trans[i];
            if(t.type == "br")
            {
                lines.push(lineHeight);
                lineY += lineHeight;
                lineX = paddingWidth;
                lineHeight = 0;
            } 
            else {
                this.ctx.font = this.ScaleFontSize(t.cssText);
                this.ctx.fillStyle = t.fillStyle;
                for(let j=0; j<t.text.length; j++)
                {
                    const charAt = t.text.charAt(j);
                    const cap = _CAP.dodum[t.capNum].chars[charAt] ?? _CAP.dodum[t.capNum].chars["가"];
                    const charWidth = (cap.width*t.fontSize/72);
                    const charHeight = (cap.height*t.fontSize/72)*lineHeightGap;

                    lineX += charWidth;
                    if(lineHeight < charHeight) {
                        lineHeight = charHeight;
                    }

                    // 글자가 상자가로 넘어가면 다음줄로 넘기기
                    if(lineX > this.width - paddingWidth*2)
                    {
                        lines.push(lineHeight);
                        lineY += lineHeight;
                        lineX = paddingWidth;
                        lineHeight = 0;
                    }
                }
            }
        }
    }

    DrawText()
    {
        if(!this.transcode) return;

        // 메모 작성                
        this.ctx.font = 18 + "px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "left"; // 수평 가운데 정렬
        // _WIN.ctx.textBaseline = "middle"; // 수직 가운데 정렬

        // trans 적용
        const trans = this.transcode;
        const paddingWidth = 20;
        const paddingHeight = 20;
        const lineHeightGap = 1.7; // 1.7은 테스트하며 맞춘수치
        let lineY = 0;
        let lineX = paddingWidth;
        let lineHeight = 0;
        const lines = [];
        
        for(let i=0; i<trans.length; i++)
        {
            let t = trans[i];
            if(t.type == "br")
            {
                lines.push(lineHeight);
                lineY += lineHeight;
                lineX = paddingWidth;
                lineHeight = 0;
            } 
            else {
                this.ctx.font = this.ScaleFontSize(t.cssText);
                this.ctx.fillStyle = t.fillStyle;
                for(let j=0; j<t.text.length; j++)
                {
                    const charAt = t.text.charAt(j);
                    const cap = _CAP.dodum[t.capNum].chars[charAt] ?? _CAP.dodum[t.capNum].chars["가"];
                    const charWidth = (cap.width*t.fontSize/72);
                    const charHeight = (cap.height*t.fontSize/72)*lineHeightGap;

                    lineX += charWidth;
                    if(lineHeight < charHeight) {
                        lineHeight = charHeight;
                    }

                    // 글자가 상자가로 넘어가면 다음줄로 넘기기
                    if(lineX > this.width - paddingWidth*2)
                    {
                        lines.push(lineHeight);
                        lineY += lineHeight;
                        lineX = paddingWidth;
                        lineHeight = 0;
                    }
                }
            }
        }
        // 마지막 사이즈 저장
        lines.push(lineHeight);

        // 텍스트 그리기 시작
        let lineCnt = 0;
        lineY = lines[lineCnt];
        lineX = paddingWidth;
        for(let i=0; i<trans.length; i++)
        {
            let t = trans[i];

            if(t.type == "br")
            {
                lineCnt++;
                lineY += (lines[lineCnt] > 0)? lines[lineCnt]:18;
                lineX = paddingWidth;
            } 
            else {
                this.ctx.font = this.ScaleFontSize(t.cssText);
                this.ctx.fillStyle = t.fillStyle;
                for(let j=0; j<t.text.length; j++)
                {
                    const charAt = t.text.charAt(j);
                    const cap = _CAP.dodum[t.capNum].chars[charAt] ?? _CAP.dodum[t.capNum].chars["가"];
                    const charWidth = (cap.width*t.fontSize/72);
                    this.ctx.fillText(charAt, lineX, lineY);
                   
                    lineX += charWidth;
                    // 글자가 상자가로 넘어가면 다음줄로 넘기기
                    if(lineX > this.width - paddingWidth*2)
                    {
                        lineCnt++;
                        lineY += (lines[lineCnt] > 0)? lines[lineCnt]:18;
                        lineX = paddingWidth;
                    }
                }
            }
        }
        this.textHeight = lineY + paddingHeight;
    }

    ScaleFontSize(fontString)
    {
        // 정규식으로 "숫자px" 부분 찾기
        return fontString.replace(/(\d+(\.\d+)?)px/, (match, p1) => {
            const newSize = Math.round(parseFloat(p1));
            return `${newSize}px`;
        });
    }

    onClick()
    {
        _EDT.Load(this);
        _EDT.display = true;
    }
}



