

export class _TRANS_CANVAS
{
    constructor()
    {
        this.cav = document.createElement("canvas");
        this.ctx = this.cav.getContext("2d");
    }
}

/**
 * 엘리먼트를 복사해서 이미지로 반환
 */
export class _CAPTURE
{
    constructor(targetElement)
    {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.visibility = 'hidden';
        document.body.appendChild(this.div);

        const json = this.GenerateFont("Arial");
        this.dodum = json;
        
        // this.DownloadJSON(json, "돋움") 
    }

    /**
     * 한 문자의 가로·세로 길이를 반환
     * @param {string} char 측정할 문자
     * @param {object} options {fontFamily, fontSize, fontWeight, fontStyle}
     * @returns {object} {width, height}
     */
    GetCharSize(ctx, char, options = {}) 
    {
        const fontFamily = options.fontFamily || 'Arial';
        const fontSize = options.fontSize || 72; // 크롬브라우저 기본폰트크기 16px
        const fontWeight = options.fontWeight || 'normal';
        const fontStyle = options.fontStyle || 'normal';

        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
        const metrics = ctx.measureText(char);
        // "_" 문자의경우 마이너스라 차지하는 높이만 계산하면 되므로, max로 묶음
        const ascent = Math.max(0, metrics.actualBoundingBoxAscent || 0); 
       
        // div 스타일 적용
        this.div.style.fontFamily = fontFamily;
        this.div.style.fontSize   = fontSize + "px";
        this.div.style.fontWeight = fontWeight;
        this.div.style.fontStyle  = fontStyle;
        this.div.textContent = char;
        
        const rect = this.div.getBoundingClientRect();
        let width = Math.round(rect.width);
        const height = Math.round(ascent*1.2);

        // 공백문자는 단독으로 div 에 넣을시, 무시돼서 measureText 로 계산위해 추가
        if(width === 0) {
            width = Math.round(metrics.width);
        }

        return {width, height};
    }

    GetCharType(ch) 
    {
        const code = ch.codePointAt(0);

        if (code >= 0xAC00 && code <= 0xD7A3) return '한글 완성형';
        if (code >= 0x3130 && code <= 0x318F) return '한글 자모';
        if (code >= 0x1100 && code <= 0x11FF) return '한글 자모 (초성/종성)';
        if ((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A)) return '영어';
        if (code >= 0x30 && code <= 0x39) return '숫자';
        if (
            (code >= 0x0021 && code <= 0x002F) || // !"#$%&'()*+,-./
            (code >= 0x003A && code <= 0x0040) || // :;<=>?@
            (code >= 0x005B && code <= 0x0060) || // [\]^_`
            (code >= 0x007B && code <= 0x007E)    // {|}~
        ) return '특수문자';

        return '기타';
    }
    GenerateFont(fontFamily)
    {
        const no_no = this.GenerateCharJSON({
            fontFamily: fontFamily,
            fontSize: 72,
            fontWeight: '',
            fontStyle: ''
        });
        const bold_no = this.GenerateCharJSON({
            fontFamily: fontFamily,
            fontSize: 72,
            fontWeight: 'bold',
            fontStyle: ''
        });
        const no_italic = this.GenerateCharJSON({
            fontFamily: fontFamily,
            fontSize: 72,
            fontWeight: '',
            fontStyle: 'italic'
        });
        const bold_italic = this.GenerateCharJSON({
            fontFamily: fontFamily,
            fontSize: 72,
            fontWeight: 'bold',
            fontStyle: 'italic'
        });
        
        const temp = {};
        temp[1] = no_no;
        temp[2] = bold_no;
        temp[3] = no_italic;
        temp[4] = bold_italic;

        return temp;
    }
    GenerateCharJSON(options = {}) 
    {
        const fontFamily = options.fontFamily || 'Arial';
        const fontSize = options.fontSize || 72; // 크롬브라우저 기본폰트크기 16px
        const fontWeight = options.fontWeight || '';
        const fontStyle = options.fontStyle || '';
        const cssText      = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`.trim();
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        
        // 문자 사이즈별 나눔예시
        const chars =
            "abcdefghijklmnopqrstuvwxyz" +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "가" +
            "0123456789" +            
            "`~!@#$%^&*()-_=+[{]}\|,<.>/?;:'\"" +            
            "←↑→↓↖↗↘↙↔↕⟶⟵⟷⤴⤵★☆■□●○" + // 화살표 & 심볼
            "\u00A0 ";

        const charMap = {
            cssText: cssText,
            style: {
                fontSize:fontSize,
                fontFamily:fontFamily,
                fontWeight:fontWeight,
                fontStyle:fontStyle
            },
            chars: {}
        };

        for(let i=0; i<chars.length; i++) {
            const ch = chars.charAt(i);
            charMap.chars[ch] = this.GetCharSize(ctx, ch, { fontFamily, fontSize, fontWeight, fontStyle });
        }

        return charMap;
    }

    DownloadJSON(obj, filename) 
    {
        console.log(obj, filename)
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

}