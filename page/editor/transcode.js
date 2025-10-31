
export function TransHtmlToCanvas(htmlString) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = htmlString;

  const nodes = Array.from(wrapper.childNodes);
  const trans = [];

  for (let node of nodes) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
      trans.push({
        type: "br",
        text: "\n"
      });
    } 
    else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "SPAN") {
      const fillStyle  = node.style.color || "black";
      const fontFamily = node.style.fontFamily || "Arial";
      const fontStyle  = node.style.fontStyle || "";
      const fontWeight = node.style.fontWeight || "";
      const fontSize   = node.style.fontSize ? parseFloat(node.style.fontSize) : 18;
      const cssText    = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`.trim();
      let capNum = 1;
      if (fontStyle === "" && fontWeight === "bold") capNum = 2;
      else if (fontStyle === "italic" && fontWeight === "") capNum = 3;
      else if (fontStyle === "italic" && fontWeight === "bold") capNum = 4;

      // span 안 텍스트를 <br> 기준으로 분리
      const parts = node.innerHTML.split(/<br\s*\/?>/i); 
      parts.forEach((part, index) => {
        // HTML 엔티티나 태그 제거
        const text = part.replace(/<[^>]*>/g, "");
        if (text.length > 0) {
          trans.push({
            type: "span",
            text: text,
            fillStyle,
            fontFamily,
            fontStyle,
            fontWeight,
            fontSize,
            cssText,
            capNum
          });
        }
        // br이 있으면 그 사이마다 삽입
        if (index < parts.length - 1) {
          trans.push({ type: "br", text: "\n" });
        }
      });
    } 
    else {
      // 일반 텍스트 노드
      const text = node.textContent;
      if (text.length > 0) {
        trans.push({
          type: "text",
          text,
          fillStyle: "black",
          fontFamily: "Arial",
          fontStyle: "",
          fontWeight: "",
          fontSize: 18,
          cssText: "18px Arial",
          capNum: 1
        });
      }
    }
  }

  return trans;
}

// export function TransHtmlToCanvas(htmlString)
// {

//   const wrapper = document.createElement("div");
//   wrapper.innerHTML = htmlString;

//   // childNodes를 배열로
//   const nodes = Array.from(wrapper.childNodes);
//   const trans = [];
//   for(let node of nodes)
//   {

    
//     if (node.nodeType === Node.ELEMENT_NODE &&
//         node.tagName === "BR")
//     {
//       trans.push({
//         type: "br",
//         text: "\n"
//       });
//     }
//     else if (node.nodeType === Node.ELEMENT_NODE &&
//         node.tagName === "SPAN" &&
//         node.getAttribute("style")) 
//     {
//       const fillStyle  = (node.style.color != "")? node.style.color:"black";
//       const fontFamily = (node.style.fontFamily != "")? node.style.fontFamily:"Arial"; 
//       const fontStyle  = node.style.fontStyle ?? "";
//       const fontWeight = node.style.fontWeight ?? "";
//       const fontSize   = (node.style.fontSize != "")? parseFloat(node.style.fontSize):18;
      
//       const cssText    = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`.trim();
//       let capNum = 1;
//       if(fontStyle == "" && fontWeight == "") capNum = 1;
//       else if(fontStyle == "" && fontWeight == "bold") capNum = 2;
//       else if(fontStyle == "italic" && fontWeight == "") capNum = 3;
//       else if(fontStyle == "italic" && fontWeight == "bold") capNum = 4;

//       trans.push({
//         type: "span",
//         text: node.textContent,
//         fillStyle: fillStyle,
//         fontFamily: fontFamily,
//         fontStyle: fontStyle,
//         fontWeight: fontWeight,
//         fontSize: fontSize,
//         cssText: cssText,
//         capNum: capNum
//       });
        
//     }
//     else {

//       const fillStyle  = "black";
//       const fontFamily = "Arial"; 
//       const fontStyle  = "";
//       const fontWeight = "";
//       const fontSize   = 18;
//       const cssText    = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`.trim();

   
//       trans.push({
//         type: "text",
//         text: node.textContent,
//         fillStyle: fillStyle,
//         fontFamily: fontFamily,
//         fontStyle: fontStyle,
//         fontWeight: fontWeight,
//         fontSize: fontSize,
//         cssText: cssText,
//         capNum: 1
//       });
      
//     }
//   }
//   return trans;
// }
