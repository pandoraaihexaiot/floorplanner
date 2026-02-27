import React, { useState, useRef, useEffect } from "react";

const ID = () => "e" + Math.random().toString(36).slice(2, 7);
const AID = () => "a" + Math.random().toString(36).slice(2, 7);

/* ─── Element Type Definitions ─── */
const ELEMENT_TYPES = {
  machine:    { label: "Machine",       icon: "⚙️", color: "#1565c0", pattern: "solid",   shortcut: "M" },
  window:     { label: "Window",        icon: "🪟", color: "#00897b", pattern: "solid",   shortcut: "W" },
  door:       { label: "Door",          icon: "🚪", color: "#6d4c41", pattern: "solid",   shortcut: "D" },
  pipe:       { label: "Pipe / Duct",   icon: "🔧", color: "#7b1fa2", pattern: "dashed",  shortcut: "P" },
  walkway:    { label: "Walkway",       icon: "🚶", color: "#f9a825", pattern: "hatched", shortcut: "K" },
  washroom:   { label: "Washroom",      icon: "🚻", color: "#00838f", pattern: "solid",   shortcut: "R" },
  wall:       { label: "Wall",          icon: "🧱", color: "#455a64", pattern: "solid",   shortcut: "L" },
  electrical: { label: "Electrical",    icon: "⚡", color: "#e65100", pattern: "solid",   shortcut: "E" },
  safety:     { label: "Safety Equip",  icon: "🧯", color: "#c62828", pattern: "solid",   shortcut: "S" },
  zone:       { label: "Zone / Area",   icon: "📐", color: "#37474f", pattern: "solid",   shortcut: "Z" },
  partition:  { label: "Partition",     icon: "▬",  color: "#546e7a", pattern: "dashed",  shortcut: "T" },
  aircon:     { label: "Air Condition", icon: "❄️", color: "#0097a7", pattern: "solid",   shortcut: "A" },
  cctv:       { label: "CCTV",         icon: "👁️", color: "#4a148c", pattern: "solid",   shortcut: "C" },
};

const ARROW_COLORS = ["#1565c0","#c62828","#2e7d32","#e65100","#6a1b9a","#00838f","#d84315","#455a64"];

/* ─── Demo Template ─── */
const DEMO = [
  // Outer walls
  { name:"North Wall",    type:"wall", x:0,  y:0,  w:200, h:3,  rotation:0, notes:"" },
  { name:"South Wall",    type:"wall", x:0,  y:147, w:200, h:3,  rotation:0, notes:"" },
  { name:"West Wall",     type:"wall", x:0,  y:0,  w:3,   h:150, rotation:0, notes:"" },
  { name:"East Wall",     type:"wall", x:197, y:0, w:3,   h:150, rotation:0, notes:"" },
  // Doors
  { name:"Main Entry",    type:"door", x:90, y:147, w:20, h:3,  rotation:0, notes:"Double door - main personnel entry" },
  { name:"Loading Door",  type:"door", x:0,  y:40,  w:3,  h:25, rotation:0, notes:"Roll-up loading bay" },
  { name:"Emergency Exit", type:"door", x:197, y:110, w:3, h:15, rotation:0, notes:"Emergency exit only" },
  // Windows
  { name:"Window N1",     type:"window", x:30,  y:0, w:25, h:3, rotation:0, notes:"" },
  { name:"Window N2",     type:"window", x:140, y:0, w:30, h:3, rotation:0, notes:"" },
  { name:"Window E1",     type:"window", x:197, y:20, w:3, h:20, rotation:0, notes:"" },
  // Machines
  { name:"CNC Mill #1",   type:"machine", x:20,  y:20,  w:30, h:25, rotation:0, notes:"Haas VF-2, 3-axis" },
  { name:"CNC Mill #2",   type:"machine", x:20,  y:55,  w:30, h:25, rotation:0, notes:"Haas VF-2, 3-axis" },
  { name:"Lathe #1",      type:"machine", x:65,  y:20,  w:25, h:20, rotation:0, notes:"Mazak QT-250" },
  { name:"Press Brake",   type:"machine", x:65,  y:50,  w:25, h:20, rotation:0, notes:"Amada HFE 100-3" },
  { name:"Welding St. A", type:"machine", x:110, y:20,  w:20, h:20, rotation:0, notes:"MIG welding station" },
  { name:"Welding St. B", type:"machine", x:110, y:50,  w:20, h:20, rotation:0, notes:"TIG welding station" },
  { name:"Assembly #1",   type:"machine", x:145, y:20,  w:40, h:25, rotation:0, notes:"Final assembly bench" },
  { name:"Assembly #2",   type:"machine", x:145, y:55,  w:40, h:25, rotation:0, notes:"Sub-assembly station" },
  // Walkways
  { name:"Main Aisle",    type:"walkway", x:10,  y:85,  w:180, h:10, rotation:0, notes:"Main walkway - keep clear" },
  { name:"Side Aisle",    type:"walkway", x:100, y:10,  w:8,   h:75, rotation:0, notes:"Access between zones" },
  // Pipes
  { name:"Air Supply",    type:"pipe", x:15,  y:8,  w:170, h:4, rotation:0, notes:"Compressed air main line" },
  { name:"Water Line",    type:"pipe", x:8,   y:15, w:4,   h:80, rotation:0, notes:"Industrial water supply" },
  // Utility / Electrical
  { name:"Main Panel",    type:"electrical", x:170, y:100, w:15, h:12, rotation:0, notes:"400A main distribution panel" },
  { name:"Sub Panel A",   type:"electrical", x:55,  y:8,   w:8,  h:8,  rotation:0, notes:"Zone A sub-panel 100A" },
  { name:"Sub Panel B",   type:"electrical", x:135, y:8,   w:8,  h:8,  rotation:0, notes:"Zone B sub-panel 100A" },
  // Safety
  { name:"Fire Ext. 1",   type:"safety", x:5,   y:85, w:5, h:5, rotation:0, notes:"ABC dry chemical" },
  { name:"Fire Ext. 2",   type:"safety", x:190, y:85, w:5, h:5, rotation:0, notes:"ABC dry chemical" },
  { name:"First Aid",     type:"safety", x:170, y:135, w:12, h:10, rotation:0, notes:"First aid station" },
  // Washroom
  { name:"Washroom",      type:"washroom", x:160, y:115, w:25, h:20, rotation:0, notes:"2 stalls, 2 sinks" },
  // Zones
  { name:"QC Inspection", type:"zone", x:15,  y:100, w:40, h:40, rotation:0, notes:"Quality control area" },
  { name:"Raw Material",  type:"zone", x:60,  y:100, w:35, h:40, rotation:0, notes:"Incoming material staging" },
  { name:"Finished Goods",type:"zone", x:100, y:100, w:40, h:40, rotation:0, notes:"Outgoing product staging" },
  // Partitions
  { name:"Zone A/B Divider", type:"partition", x:95, y:10, w:2, h:75, rotation:0, notes:"Separates machining from welding" },
  { name:"QC Partition",     type:"partition", x:55, y:100, w:2, h:40, rotation:0, notes:"QC area divider" },
  { name:"Office Partition", type:"partition", x:140, y:100, w:45, h:2, rotation:0, notes:"Separates staging from facilities" },
  // Air Conditioning
  { name:"AC Unit 1",  type:"aircon", x:45, y:3, w:8, h:8, rotation:0, notes:"Zone A cooling - 5 ton split" },
  { name:"AC Unit 2",  type:"aircon", x:155, y:3, w:8, h:8, rotation:0, notes:"Zone B cooling - 5 ton split" },
  { name:"AC Unit 3",  type:"aircon", x:150, y:100, w:8, h:8, rotation:0, notes:"FG area climate control" },
  // CCTV
  { name:"CCTV Entry",   type:"cctv", x:95, y:143, w:3, h:3, rotation:0, notes:"Main entry camera" },
  { name:"CCTV Loading",  type:"cctv", x:3, y:42, w:3, h:3, rotation:0, notes:"Loading bay camera" },
  { name:"CCTV Floor NW", type:"cctv", x:5, y:5, w:3, h:3, rotation:0, notes:"NW corner overhead" },
  { name:"CCTV Floor NE", type:"cctv", x:190, y:5, w:3, h:3, rotation:0, notes:"NE corner overhead" },
  { name:"CCTV FG Area",  type:"cctv", x:135, y:105, w:3, h:3, rotation:0, notes:"Finished goods monitoring" },
].map((r,i)=>({...r, id:ID(), color: ELEMENT_TYPES[r.type]?.color || "#555" }));

const GRID_SIZE = 5;
const snap = (v, enabled) => enabled ? Math.round(v / GRID_SIZE) * GRID_SIZE : Math.round(v);

export default function App(){
  const [elements, setElements] = useState(DEMO);
  const [arrows, setArrows] = useState([
    { id:AID(), x1:35,y1:45, x2:77,y2:30, color:"#1565c0", label:"Material Flow", style:"solid" },
    { id:AID(), x1:77,y1:40, x2:120,y2:30, color:"#1565c0", label:"To Welding", style:"dashed" },
    { id:AID(), x1:120,y1:40, x2:165,y2:32, color:"#2e7d32", label:"To Assembly", style:"dashed" },
    { id:AID(), x1:165,y1:50, x2:120,y2:110, color:"#c62828", label:"Finished → FG", style:"solid" },
  ]);
  const [sel, setSel] = useState(null);
  const [selA, setSelA] = useState(null);
  const [floorW, setFloorW] = useState(200);
  const [floorH, setFloorH] = useState(150);
  const [zoom, setZoom] = useState(3.5);
  const [msg, setMsg] = useState("");
  const [view, setView] = useState("editor");
  const [showPanel, setShowPanel] = useState(true);
  const [gridSnap, setGridSnap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [hiddenTypes, setHiddenTypes] = useState(new Set());
  const [addType, setAddType] = useState("machine");
  const [roomName, setRoomName] = useState("Production Floor A");
  const [clipboard, setClipboard] = useState(null); // for Ctrl+C/V
  const dragRef = useRef(null);
  const fileInputRef = useRef(null);

  const S = zoom;
  const selE = elements.find(r=>r.id===sel);
  const selAr = arrows.find(a=>a.id===selA);
  const total = floorW * floorH;
  const flash = (t) => { setMsg(t); setTimeout(()=>setMsg(""),2500); };

  // ─── History ───
  const histRef = useRef([JSON.stringify({elements:DEMO,arrows:[]})]);
  const hiRef = useRef(0);
  const skipRef = useRef(false);
  const tmRef = useRef(null);

  useEffect(()=>{
    clearTimeout(tmRef.current);
    tmRef.current = setTimeout(()=>{
      if(skipRef.current){skipRef.current=false;return;}
      const s=JSON.stringify({elements,arrows});
      histRef.current = histRef.current.slice(0,hiRef.current+1);
      histRef.current.push(s);
      if(histRef.current.length>50)histRef.current.shift();
      hiRef.current=histRef.current.length-1;
    },500);
  },[elements,arrows]);

  const undo = () => { if(hiRef.current<=0)return; hiRef.current--; skipRef.current=true; const d=JSON.parse(histRef.current[hiRef.current]); setElements(d.elements||[]); setArrows(d.arrows||[]); };
  const redo = () => { if(hiRef.current>=histRef.current.length-1)return; hiRef.current++; skipRef.current=true; const d=JSON.parse(histRef.current[hiRef.current]); setElements(d.elements||[]); setArrows(d.arrows||[]); };

  // ─── Drag ───
  useEffect(()=>{
    const onMove = (e) => {
      const d = dragRef.current; if(!d) return;
      const dx = (e.clientX - d.mx) / S, dy = (e.clientY - d.my) / S;
      if(d.kind==="element"){
        if(d.type==="move") setElements(p=>p.map(r=>r.id===d.id?{...r,
          x:snap(Math.max(0,Math.min(floorW-d.ow, d.ox+dx)), gridSnap),
          y:snap(Math.max(0,Math.min(floorH-d.oh, d.oy+dy)), gridSnap)
        }:r));
        else if(d.type==="br") setElements(p=>p.map(r=>r.id===d.id?{...r,
          w:snap(Math.min(Math.max(3,d.ow+dx),floorW-r.x), gridSnap),
          h:snap(Math.min(Math.max(3,d.oh+dy),floorH-r.y), gridSnap)
        }:r));
      } else if(d.kind==="arrow"){
        if(d.type==="move"){
          const adx=Math.round(dx), ady=Math.round(dy);
          setArrows(p=>p.map(a=>a.id===d.id?{...a,x1:d.ox1+adx,y1:d.oy1+ady,x2:d.ox2+adx,y2:d.oy2+ady}:a));
        } else if(d.type==="p1") setArrows(p=>p.map(a=>a.id===d.id?{...a,x1:snap(d.ox1+dx,gridSnap),y1:snap(d.oy1+dy,gridSnap)}:a));
        else if(d.type==="p2") setArrows(p=>p.map(a=>a.id===d.id?{...a,x2:snap(d.ox2+dx,gridSnap),y2:snap(d.oy2+dy,gridSnap)}:a));
      }
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
    return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);};
  },[S,floorW,floorH,gridSnap]);

  // ─── Keys ───
  useEffect(()=>{
    const h=(e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="SELECT") return;
      if((e.metaKey||e.ctrlKey)&&e.key==="z"){e.preventDefault();undo();}
      if((e.metaKey||e.ctrlKey)&&e.key==="y"){e.preventDefault();redo();}
      if(e.key==="Delete"||e.key==="Backspace"){
        if(selA){setArrows(p=>p.filter(a=>a.id!==selA));setSelA(null);}
        else if(sel){setElements(p=>p.filter(r=>r.id!==sel));setSel(null);}
      }
      // Rotation with R key
      if(e.key==="r"&&sel&&!e.metaKey&&!e.ctrlKey){
        setElements(p=>p.map(r=>r.id===sel?{...r,rotation:((r.rotation||0)+90)%360}:r));
      }
      // Ctrl+C — copy selected element or arrow
      if((e.metaKey||e.ctrlKey)&&e.key==="c"){
        if(sel){
          const el = elements.find(r=>r.id===sel);
          if(el){ e.preventDefault(); setClipboard({kind:"element",data:{...el}}); flash("📋 Copied element"); }
        } else if(selA){
          const ar = arrows.find(a=>a.id===selA);
          if(ar){ e.preventDefault(); setClipboard({kind:"arrow",data:{...ar}}); flash("📋 Copied arrow"); }
        }
      }
      // Ctrl+V — paste copied element or arrow
      if((e.metaKey||e.ctrlKey)&&e.key==="v"&&clipboard){
        e.preventDefault();
        if(clipboard.kind==="element"){
          const nid=ID();
          const d=clipboard.data;
          const newEl={...d, id:nid, x:Math.min(d.x+10,floorW-d.w), y:Math.min(d.y+10,floorH-d.h), name:d.name+(d.name.includes("copy")?"":" copy")};
          setElements(p=>[...p,newEl]); setSel(nid); setSelA(null);
          flash("📌 Pasted element");
        } else if(clipboard.kind==="arrow"){
          const nid=AID();
          const d=clipboard.data;
          setArrows(p=>[...p,{...d, id:nid, x1:d.x1+15, y1:d.y1+15, x2:d.x2+15, y2:d.y2+15, label:d.label?d.label+(d.label.includes("copy")?"":" copy"):""}]);
          setSelA(nid); setSel(null);
          flash("📌 Pasted arrow");
        }
      }
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  });

  // ─── CRUD ───
  const addElement = (type) => {
    const td = ELEMENT_TYPES[type];
    const id=ID();
    const defaults = {
      machine:{w:25,h:20}, window:{w:15,h:2}, door:{w:12,h:3}, pipe:{w:40,h:3},
      walkway:{w:50,h:8}, washroom:{w:20,h:15}, wall:{w:40,h:3}, electrical:{w:8,h:8},
      safety:{w:5,h:5}, zone:{w:35,h:30}, partition:{w:20,h:2}, aircon:{w:8,h:8}, cctv:{w:3,h:3}
    };
    const sz = defaults[type]||{w:20,h:15};
    setElements(p=>[...p,{id,name:td.label,type,x:snap(10,gridSnap),y:snap(10,gridSnap),w:sz.w,h:sz.h,color:td.color,rotation:0,notes:""}]);
    setSel(id); setSelA(null);
  };

  const addArrow = () => {
    const id=AID();
    setArrows(p=>[...p,{id,x1:20,y1:20,x2:80,y2:20,color:"#1565c0",label:"",style:"dashed"}]);
    setSelA(id); setSel(null); setShowPanel(true);
  };

  const selectElement = (id) => { setSel(id); setSelA(null); };
  const selectArrow = (id) => { setSelA(id); setSel(null); };
  const clearSelection = () => { setSel(null); setSelA(null); };

  const toggleLayerType = (type) => {
    setHiddenTypes(prev => {
      const next = new Set(prev);
      if(next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  // ─── Save / Load (direct file) ───
  const doSave = () => {
    const data = JSON.stringify({elements,arrows,floorW,floorH,roomName},null,2);
    const blob = new Blob([data],{type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(roomName||"floor-plan").replace(/[^a-zA-Z0-9 _-]/g,"").replace(/\s+/g,"_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flash("💾 File saved!");
  };

  const doLoad = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.elements){
          setElements(d.elements);
          setArrows(d.arrows||[]);
          if(d.floorW) setFloorW(d.floorW);
          if(d.floorH) setFloorH(d.floorH);
          if(d.roomName) setRoomName(d.roomName);
          flash("✅ Loaded!");
        } else flash("❌ Invalid data");
      } catch{ flash("❌ Invalid JSON file"); }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset so same file can be re-loaded
  };



  // ─── Export via Canvas (PNG + Print-to-PDF) ───
  const [previewDataUrl, setPreviewDataUrl] = useState(null);
  const printFrameRef = useRef(null);

  const hexToRgb = (hex) => {
    hex = hex.replace("#","");
    if(hex.length===3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const n = parseInt(hex.substring(0,6),16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  };
  const rgbaStr = (hex,a=1)=>{const[r,g,b]=hexToRgb(hex);return `rgba(${r},${g},${b},${a})`;};

  const renderToCanvas = () => {
    const landscape = floorW >= floorH;
    const PW = landscape ? 2480 : 1754;
    const PH = landscape ? 1754 : 2480;
    const margin = 80;
    const titleH = 110;

    const canvas = document.createElement("canvas");
    canvas.width = PW; canvas.height = PH;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#f8fbff";
    ctx.fillRect(0,0,PW,PH);

    // Border
    ctx.strokeStyle = "#1a3a5c"; ctx.lineWidth = 3;
    ctx.strokeRect(20,20,PW-40,PH-40);

    // Title
    ctx.font = "bold 36px 'Courier New', monospace";
    ctx.fillStyle = "#1a3a5c"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillText((roomName||"FLOOR PLAN").toUpperCase(), margin, margin+36);

    // Subtitle
    ctx.font = "16px 'Courier New', monospace";
    ctx.fillStyle = "#6688aa";
    ctx.fillText(floorW+"ft x "+floorH+"ft  |  "+total.toLocaleString()+"sf  |  "+elements.length+" elements  |  "+new Date().toLocaleDateString(), margin, margin+62);

    // Compute scale
    const availW = PW - margin*2;
    const legendH = 140;
    const availH = PH - margin - titleH - legendH - 50;
    const dsc = Math.min(availW/floorW, availH/floorH) * 0.95;
    const ox = margin + (availW - floorW*dsc)/2;
    const oy = margin + titleH;

    // Dim label top
    ctx.font = "14px 'Courier New', monospace";
    ctx.fillStyle = "#1a3a5c"; ctx.textAlign = "center";
    ctx.fillText("<-- "+floorW+" ft -->", ox + floorW*dsc/2, oy - 12);

    // Floor rect
    ctx.fillStyle = "#f0f5fa";
    ctx.fillRect(ox, oy, floorW*dsc, floorH*dsc);
    ctx.strokeStyle = "#1a3a5c"; ctx.lineWidth = 2.5;
    ctx.strokeRect(ox, oy, floorW*dsc, floorH*dsc);

    // Grid
    for(let gx=0;gx<=floorW;gx+=10){
      ctx.strokeStyle = gx%50===0 ? "#b0c4d8" : "#dde5ed";
      ctx.lineWidth = gx%50===0 ? 1 : 0.5;
      ctx.beginPath(); ctx.moveTo(ox+gx*dsc, oy); ctx.lineTo(ox+gx*dsc, oy+floorH*dsc); ctx.stroke();
    }
    for(let gy=0;gy<=floorH;gy+=10){
      ctx.strokeStyle = gy%50===0 ? "#b0c4d8" : "#dde5ed";
      ctx.lineWidth = gy%50===0 ? 1 : 0.5;
      ctx.beginPath(); ctx.moveTo(ox, oy+gy*dsc); ctx.lineTo(ox+floorW*dsc, oy+gy*dsc); ctx.stroke();
    }

    // Elements
    elements.forEach(r=>{
      if(hiddenTypes.has(r.type)) return;
      const td = ELEMENT_TYPES[r.type]||{};
      const rx=ox+r.x*dsc, ry=oy+r.y*dsc, rw=r.w*dsc, rh=r.h*dsc;
      const rot = (r.rotation||0)*Math.PI/180;

      ctx.save();
      if(rot!==0){ ctx.translate(rx+rw/2, ry+rh/2); ctx.rotate(rot); ctx.translate(-(rx+rw/2), -(ry+rh/2)); }

      ctx.fillStyle = rgbaStr(r.color,0.15);
      ctx.fillRect(rx,ry,rw,rh);
      ctx.strokeStyle = r.color; ctx.lineWidth = 2;
      ctx.strokeRect(rx,ry,rw,rh);

      // Patterns
      if(td.pattern==="hatched"){
        ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 1.2;
        ctx.save(); ctx.beginPath(); ctx.rect(rx,ry,rw,rh); ctx.clip();
        for(let d=-rh;d<rw+rh;d+=5){ ctx.beginPath(); ctx.moveTo(rx+d,ry); ctx.lineTo(rx+d+rh,ry+rh); ctx.stroke(); }
        ctx.restore();
      }
      if(td.pattern==="dashed"){
        ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 1.2;
        ctx.setLineDash([8,5]);
        ctx.beginPath(); ctx.moveTo(rx+3,ry+rh*0.35); ctx.lineTo(rx+rw-3,ry+rh*0.35); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rx+3,ry+rh*0.65); ctx.lineTo(rx+rw-3,ry+rh*0.65); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Name
      const maxFs = Math.min(rw/(r.name.length*0.62), rh/2.2, 20);
      if(maxFs>=6){
        ctx.font = "bold "+Math.round(maxFs)+"px 'Courier New', monospace";
        ctx.fillStyle = r.color; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(r.name.toUpperCase(), rx+rw/2, ry+rh/2);
      }
      // Dims
      if(rh>35&&rw>40){
        const ds = Math.max(7, maxFs*0.45);
        ctx.font = Math.round(ds)+"px 'Courier New', monospace";
        ctx.fillStyle = rgbaStr(r.color, 0.35); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillText(r.w+"' x "+r.h+"'", rx+rw/2, ry+rh-4);
      }
      ctx.restore();
    });

    // Arrows
    arrows.forEach(a=>{
      const ax1=ox+a.x1*dsc, ay1=oy+a.y1*dsc, ax2=ox+a.x2*dsc, ay2=oy+a.y2*dsc;
      ctx.strokeStyle = a.color; ctx.lineWidth = 3;
      if(a.style==="dashed") ctx.setLineDash([12,7]);
      else if(a.style==="dotted") ctx.setLineDash([4,5]);
      else ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(ax1,ay1); ctx.lineTo(ax2,ay2); ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead
      const ang = Math.atan2(ay2-ay1,ax2-ax1);
      const hs = 14;
      ctx.fillStyle = a.color;
      ctx.beginPath(); ctx.moveTo(ax2, ay2);
      ctx.lineTo(ax2-hs*Math.cos(ang-0.35), ay2-hs*Math.sin(ang-0.35));
      ctx.lineTo(ax2-hs*Math.cos(ang+0.35), ay2-hs*Math.sin(ang+0.35));
      ctx.closePath(); ctx.fill();

      if(a.label){
        const mx=(ax1+ax2)/2, my=(ay1+ay2)/2;
        ctx.font = "bold 12px 'Courier New', monospace";
        ctx.fillStyle = a.color; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillText(a.label, mx, my-8);
      }
    });

    // Vertical dims
    ctx.save(); ctx.font = "14px 'Courier New', monospace"; ctx.fillStyle = "#1a3a5c"; ctx.textAlign = "center";
    ctx.translate(ox-20, oy+floorH*dsc/2); ctx.rotate(-Math.PI/2);
    ctx.fillText(floorH+" ft", 0, 0); ctx.restore();
    ctx.save(); ctx.translate(ox+floorW*dsc+20, oy+floorH*dsc/2); ctx.rotate(Math.PI/2);
    ctx.font = "14px 'Courier New', monospace"; ctx.fillStyle = "#1a3a5c"; ctx.textAlign = "center";
    ctx.fillText(floorH+" ft", 0, 0); ctx.restore();

    // Bottom dim
    ctx.font = "14px 'Courier New', monospace"; ctx.fillStyle = "#1a3a5c"; ctx.textAlign = "center";
    ctx.fillText("<-- "+floorW+" ft -->", ox + floorW*dsc/2, oy+floorH*dsc+18);

    // Legend
    const ly = oy + floorH*dsc + 35;
    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.fillStyle = "#1a3a5c"; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText("LEGEND", margin, ly);

    const types = Object.entries(ELEMENT_TYPES);
    const cols = landscape ? 5 : 4;
    const colW = availW/cols;
    ctx.font = "11px 'Courier New', monospace";
    types.forEach(([key,td],i)=>{
      const c=i%cols, row=Math.floor(i/cols);
      const lx=margin+c*colW, lry=ly+24+row*22;
      ctx.fillStyle = rgbaStr(td.color,0.2); ctx.fillRect(lx,lry,14,14);
      ctx.strokeStyle = td.color; ctx.lineWidth = 1.2; ctx.strokeRect(lx,lry,14,14);
      ctx.fillStyle = "#3a5a7c"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
      ctx.fillText(td.label, lx+20, lry+7);
    });

    // Branding
    ctx.font = "12px 'Courier New', monospace";
    ctx.fillStyle = "#9ab0c8"; ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    ctx.fillText("Powered by Pandora AI  |  www.hexaiot.com.my", PW-margin, PH-30);

    return canvas;
  };

  const generatePreview = () => {
    try {
      const canvas = renderToCanvas();
      const dataUrl = canvas.toDataURL("image/png");
      setPreviewDataUrl(dataUrl);
      setView("export");
    } catch(err){ flash("Export failed"); console.error(err); }
  };

  const downloadPNG = () => {
    try {
      const canvas = renderToCanvas();
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = (roomName||"floor-plan").replace(/[^a-zA-Z0-9 _-]/g,"").replace(/\s+/g,"_")+".png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        flash("PNG downloaded!");
      }, "image/png");
    } catch(err){ flash("Download failed"); console.error(err); }
  };

  const downloadPDF = () => {
    try {
      const canvas = renderToCanvas();
      // Get raw JPEG bytes properly
      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const base64 = jpegDataUrl.split(",")[1];
      const binaryStr = atob(base64);
      const imgLen = binaryStr.length;
      const imgBytes = new Uint8Array(imgLen);
      for(let i=0;i<imgLen;i++) imgBytes[i] = binaryStr.charCodeAt(i);

      const cw = canvas.width, ch = canvas.height;
      const landscape = floorW >= floorH;
      // A4 in points: 595.28 x 841.89
      const pageW = landscape ? 841.89 : 595.28;
      const pageH = landscape ? 595.28 : 841.89;
      const pad = 10;
      const scale = Math.min((pageW-pad*2)/cw, (pageH-pad*2)/ch);
      const iw = cw*scale, ih = ch*scale;
      const ix = (pageW-iw)/2, iy = (pageH-ih)/2;

      // Build PDF with proper byte offsets
      const te = new TextEncoder();
      const textParts = [];
      const offsets = [];

      const header = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";
      textParts.push(te.encode(header));

      // Track offset
      let pos = textParts[0].length;

      // Obj 1 - Catalog
      offsets.push(pos);
      const o1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
      textParts.push(te.encode(o1)); pos += te.encode(o1).length;

      // Obj 2 - Pages
      offsets.push(pos);
      const o2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
      textParts.push(te.encode(o2)); pos += te.encode(o2).length;

      // Obj 3 - Page
      offsets.push(pos);
      const o3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pageW.toFixed(2) + " " + pageH.toFixed(2) + "] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>\nendobj\n";
      textParts.push(te.encode(o3)); pos += te.encode(o3).length;

      // Obj 4 - Content stream
      offsets.push(pos);
      const stm = "q " + iw.toFixed(2) + " 0 0 " + ih.toFixed(2) + " " + ix.toFixed(2) + " " + (pageH - iy - ih).toFixed(2) + " cm /Im0 Do Q";
      const o4 = "4 0 obj\n<< /Length " + stm.length + " >>\nstream\n" + stm + "\nendstream\nendobj\n";
      textParts.push(te.encode(o4)); pos += te.encode(o4).length;

      // Obj 5 - Image (split into text header + binary + text footer)
      offsets.push(pos);
      const imgHead = "5 0 obj\n<< /Type /XObject /Subtype /Image /Width " + cw + " /Height " + ch + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + imgLen + " >>\nstream\n";
      const imgFoot = "\nendstream\nendobj\n";
      textParts.push(te.encode(imgHead)); pos += te.encode(imgHead).length;
      textParts.push(imgBytes); pos += imgBytes.length;
      textParts.push(te.encode(imgFoot)); pos += te.encode(imgFoot).length;

      // XRef table
      const xrefPos = pos;
      let xref = "xref\n0 6\n0000000000 65535 f \n";
      for(let i=0;i<offsets.length;i++){
        xref += offsets[i].toString().padStart(10,"0") + " 00000 n \n";
      }
      xref += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xrefPos + "\n%%EOF";
      textParts.push(te.encode(xref));

      // Combine all parts
      const totalLen = textParts.reduce((s,p)=>s+p.length,0);
      const result = new Uint8Array(totalLen);
      let off = 0;
      textParts.forEach(p=>{ result.set(p, off); off += p.length; });

      // Download
      const blob = new Blob([result], {type:"application/pdf"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (roomName||"floor-plan").replace(/[^a-zA-Z0-9 _-]/g,"").replace(/\s+/g,"_")+".pdf";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(()=>URL.revokeObjectURL(url), 5000);
      flash("PDF downloaded!");
    } catch(err){ flash("PDF download failed"); console.error(err); }
  };

  // ─── Pattern CSS for canvas elements ───
  const getPatternStyle = (type) => {
    const td = ELEMENT_TYPES[type];
    if(!td) return {};
    if(td.pattern==="hatched") return {
      backgroundImage:`repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 5px)`
    };
    if(td.pattern==="dashed") return {
      backgroundImage:`repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.1) 6px, rgba(0,0,0,0.1) 9px)`
    };
    return {};
  };

  /* ─── Shared styles ─── */
  const inputSt = {width:"100%",background:"#f0f5fa",border:"1px solid #c5d5e5",borderRadius:4,color:"#1a3a5c",fontSize:12,padding:"6px 8px",marginBottom:8,outline:"none",fontFamily:"'Courier New',monospace"};
  const numInputSt = {width:"100%",background:"#f0f5fa",border:"1px solid #c5d5e5",borderRadius:3,color:"#1a3a5c",fontFamily:"'Courier New',monospace",fontSize:12,padding:"4px 6px",textAlign:"center",outline:"none"};
  const labelSt = {fontSize:8,textTransform:"uppercase",letterSpacing:1.5,color:"#7a9ab8",marginBottom:2,fontFamily:"'Courier New',monospace",fontWeight:700};
  const headerNumSt = {width:52,background:"#e8f0f8",border:"1px solid #c5d5e5",borderRadius:3,color:"#1a3a5c",fontFamily:"'Courier New',monospace",fontSize:11,padding:"3px 5px",textAlign:"center"};

  const Btn = ({onClick,children,color="#6688aa",active,style:st={}}) => (
    <button onClick={onClick} style={{padding:"5px 10px",background:active?`${color}18`:"#f0f5fa",border:`1px solid ${active?color:"#c5d5e5"}`,borderRadius:4,color:active?color:"#5a7a9a",fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'Courier New',monospace",transition:"all 0.15s",...st}}>{children}</button>
  );

  // ─── Hidden file input for Load ───
  // (rendered in main editor below)

  // ─── Export view ───
  if(view==="export") return(
    <div style={{background:"#f0f5fa",height:"100vh",color:"#1a3a5c",fontFamily:"'Courier New',monospace",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid #c5d5e5",display:"flex",alignItems:"center",gap:10,background:"#e8f0f8",flexWrap:"wrap"}}>
        <span style={{fontSize:14,fontWeight:700,color:"#1565c0"}}>📄 EXPORT</span>
        <Btn onClick={downloadPNG} color="#2e7d32" style={{padding:"6px 16px",fontSize:11}}>⬇ Download PNG</Btn>
        <Btn onClick={downloadPDF} color="#e65100" style={{padding:"6px 16px",fontSize:11}}>⬇ Download PDF</Btn>
        <Btn onClick={()=>{generatePreview();}} color="#1565c0">🔄 Refresh</Btn>
        <div style={{flex:1}}/>
        <Btn onClick={()=>{setPreviewDataUrl(null);setView("editor");}} color="#1565c0">← Back</Btn>
      </div>
      <div style={{flex:1,overflow:"auto",background:"#e0e8f0",display:"flex",justifyContent:"center",alignItems:"flex-start",padding:20}}>
        {previewDataUrl ? (
          <div style={{background:"#fff",borderRadius:8,boxShadow:"0 4px 30px rgba(0,0,0,0.08)",overflow:"hidden",display:"inline-block",border:"1px solid #c5d5e5",maxWidth:"100%"}}>
            <img src={previewDataUrl} alt="Floor Plan Export" style={{maxWidth:"100%",display:"block"}}/>
          </div>
        ) : (
          <div style={{color:"#7a9ab8",fontSize:12,marginTop:40}}>Generating preview...</div>
        )}
      </div>
    </div>
  );

  // ─── Main Editor ───
  return(
    <div style={{background:"#f0f5fa",height:"100vh",color:"#1a3a5c",fontFamily:"'Courier New',monospace",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Hidden file input for Load */}
      <input ref={fileInputRef} type="file" accept=".json" onChange={doLoad} style={{display:"none"}}/>

      {/* ═══ Header ═══ */}
      <div style={{padding:"7px 12px",borderBottom:"2px solid #1a3a5c",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",background:"#e8f0f8",flexShrink:0}}>
        <span style={{fontSize:13,color:"#7a9ab8",marginRight:0}}>📐</span>
        <input value={roomName} onChange={e=>setRoomName(e.target.value)} placeholder="Room Name…"
          style={{fontSize:14,fontWeight:700,color:"#1a3a5c",letterSpacing:1,background:"transparent",border:"1px solid transparent",borderRadius:4,padding:"3px 8px",outline:"none",fontFamily:"'Courier New',monospace",minWidth:120,maxWidth:280,
            transition:"border-color 0.15s"}}
          onFocus={e=>{e.target.style.borderColor="#1565c0";e.target.style.background="#fff";}}
          onBlur={e=>{e.target.style.borderColor="transparent";e.target.style.background="transparent";}}
        />
        <Btn onClick={undo} color="#5a7a9a">↩ Undo</Btn>
        <Btn onClick={redo} color="#5a7a9a">↪ Redo</Btn>
        <div style={{width:1,height:18,background:"#c5d5e5"}}/>
        <span style={{fontSize:9,color:"#7a9ab8"}}>FLOOR</span>
        <input type="number" value={floorW} onChange={e=>setFloorW(Math.max(20,+e.target.value||20))} style={headerNumSt}/>
        <span style={{color:"#aab8c8"}}>×</span>
        <input type="number" value={floorH} onChange={e=>setFloorH(Math.max(20,+e.target.value||20))} style={headerNumSt}/>
        <span style={{fontSize:9,color:"#7a9ab8"}}>ft</span>
        <span style={{fontSize:10,color:"#5a7a9a"}}>{total.toLocaleString()}sf</span>
        <div style={{flex:1}}/>
        <Btn onClick={doSave} color="#2e7d32">💾 Save</Btn>
        <Btn onClick={()=>fileInputRef.current?.click()} color="#1565c0">📂 Load</Btn>
        <Btn onClick={generatePreview} color="#e65100">📄 Export</Btn>
        {msg&&<span style={{fontSize:10,color:"#2e7d32",fontWeight:600}}>✓ {msg}</span>}
      </div>

      {/* ═══ Toolbar ═══ */}
      <div style={{padding:"5px 12px",borderBottom:"1px solid #c5d5e5",display:"flex",alignItems:"center",gap:6,background:"#f5f9fd",flexShrink:0,flexWrap:"wrap"}}>
        {/* Add element dropdown */}
        <select value={addType} onChange={e=>setAddType(e.target.value)} style={{background:"#e8f0f8",border:"1px solid #c5d5e5",borderRadius:4,color:"#1a3a5c",fontSize:10,padding:"4px 6px",fontFamily:"'Courier New',monospace",cursor:"pointer"}}>
          {Object.entries(ELEMENT_TYPES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
        <Btn onClick={()=>addElement(addType)} color="#2e7d32">+ Add</Btn>
        <Btn onClick={addArrow} color="#1565c0">↗ Flow Arrow</Btn>
        <div style={{width:1,height:16,background:"#c5d5e5"}}/>
        <Btn onClick={()=>{setElements(DEMO.map(r=>({...r,id:ID()})));setArrows([
          { id:AID(), x1:35,y1:45, x2:77,y2:30, color:"#1565c0", label:"Material Flow", style:"solid" },
          { id:AID(), x1:77,y1:40, x2:120,y2:30, color:"#1565c0", label:"To Welding", style:"dashed" },
        ]);setSel(null);setSelA(null);flash("Template loaded");}} color="#5a7a9a">Template</Btn>
        <Btn onClick={()=>{setElements([]);setArrows([]);setSel(null);setSelA(null);}} color="#c62828">Clear</Btn>
        <div style={{width:1,height:16,background:"#c5d5e5"}}/>
        <Btn onClick={()=>setGridSnap(!gridSnap)} color="#5a7a9a" active={gridSnap}>⊞ Snap</Btn>
        <Btn onClick={()=>setShowGrid(!showGrid)} color="#5a7a9a" active={showGrid}>▦ Grid</Btn>
        <div style={{width:1,height:16,background:"#c5d5e5"}}/>
        <span style={{fontSize:9,color:"#7a9ab8"}}>ZOOM</span>
        <input type="range" min={100} max={800} value={zoom*100} onChange={e=>setZoom(+e.target.value/100)} style={{width:70,accentColor:"#1565c0"}}/>
        <span style={{fontSize:9,color:"#1565c0"}}>{Math.round(zoom*100)}%</span>
        <span style={{fontSize:10,color:"#7a9ab8",marginLeft:4}}>Items:{elements.length}</span>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* ═══ Canvas ═══ */}
        <div style={{flex:1,overflow:"auto",background:"#e0e8f0",padding:"30px 40px 40px 40px"}} onClick={(e)=>{if(e.target===e.currentTarget)clearSelection();}}>

          {/* Top dim */}
          <div style={{width:floorW*S,textAlign:"center",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
              <div style={{flex:1,height:1,background:"#1a3a5c"}}/><span style={{fontSize:10,color:"#1a3a5c",whiteSpace:"nowrap",padding:"0 6px"}}>{floorW} ft</span><div style={{flex:1,height:1,background:"#1a3a5c"}}/>
            </div>
          </div>

          <div style={{display:"flex"}}>
            {/* Left dim */}
            <div style={{width:24,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",marginRight:4}}>
              <div style={{position:"absolute",top:0,bottom:0,left:12,width:1,background:"#1a3a5c"}}/>
              <span style={{fontSize:10,color:"#1a3a5c",writingMode:"vertical-rl",transform:"rotate(180deg)",whiteSpace:"nowrap",background:"#e0e8f0",padding:"4px 0",zIndex:1}}>{floorH} ft</span>
            </div>

            {/* ─── Main canvas ─── */}
            <div style={{position:"relative",width:floorW*S,height:floorH*S,background:"#f8fbff",border:"2px solid #1a3a5c",borderRadius:2,flexShrink:0,overflow:"hidden"}} onClick={(e)=>{if(e.target===e.currentTarget)clearSelection();}}>

              {/* Grid lines */}
              {showGrid && (
                <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}}>
                  {Array.from({length:Math.floor(floorW/GRID_SIZE)+1},(_,i)=>i*GRID_SIZE).map(gx=>(
                    <line key={`gx${gx}`} x1={gx*S} y1={0} x2={gx*S} y2={floorH*S} stroke={gx%50===0?"#b0c4d8":gx%10===0?"#d5e0ea":"#eaeff5"} strokeWidth={gx%50===0?0.8:gx%10===0?0.5:0.3}/>
                  ))}
                  {Array.from({length:Math.floor(floorH/GRID_SIZE)+1},(_,i)=>i*GRID_SIZE).map(gy=>(
                    <line key={`gy${gy}`} x1={0} y1={gy*S} x2={floorW*S} y2={gy*S} stroke={gy%50===0?"#b0c4d8":gy%10===0?"#d5e0ea":"#eaeff5"} strokeWidth={gy%50===0?0.8:gy%10===0?0.5:0.3}/>
                  ))}
                </svg>
              )}

              {/* Arrows SVG overlay */}
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:12,pointerEvents:"none",overflow:"visible"}}>
                <defs>
                  {arrows.map(a=>(
                    <marker key={a.id+"m"} id={"mh_"+a.id} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <path d={`M0,0 L10,3.5 L0,7`} fill={a.color}/>
                    </marker>
                  ))}
                </defs>
                {arrows.map(a=>{
                  const isSel=selA===a.id;
                  const dash = a.style==="dashed"?"10,5":a.style==="dotted"?"3,4":"";
                  const mx=(a.x1+a.x2)/2, my=(a.y1+a.y2)/2;
                  const ang = Math.atan2(a.y2-a.y1,a.x2-a.x1)*180/Math.PI;
                  const flip = (ang>90||ang<-90)?ang+180:ang;
                  return(
                    <g key={a.id}>
                      <line x1={a.x1*S} y1={a.y1*S} x2={a.x2*S} y2={a.y2*S} stroke="transparent" strokeWidth={16} style={{pointerEvents:"stroke",cursor:"grab"}}
                        onMouseDown={(e)=>{e.preventDefault();e.stopPropagation();selectArrow(a.id);setShowPanel(true);
                          dragRef.current={kind:"arrow",id:a.id,type:"move",mx:e.clientX,my:e.clientY,ox1:a.x1,oy1:a.y1,ox2:a.x2,oy2:a.y2};
                        }}/>
                      <line x1={a.x1*S} y1={a.y1*S} x2={a.x2*S} y2={a.y2*S} stroke={a.color} strokeWidth={isSel?3:2} strokeDasharray={dash} markerEnd={"url(#mh_"+a.id+")"} opacity={isSel?1:0.7}/>
                      {a.label && (
                        <text x={mx*S} y={my*S-6} textAnchor="middle" fontFamily="'Courier New',monospace" fontSize={Math.max(7,Math.min(8*S,11))} fill={a.color} fontWeight="bold" style={{pointerEvents:"none"}} transform={`rotate(${flip},${mx*S},${my*S-6})`}>{a.label}</text>
                      )}
                      {isSel && (
                        <>
                          <circle cx={a.x1*S} cy={a.y1*S} r={6} fill={a.color} stroke="#fff" strokeWidth={2} style={{pointerEvents:"auto",cursor:"crosshair"}}
                            onMouseDown={(e)=>{e.preventDefault();e.stopPropagation();
                              dragRef.current={kind:"arrow",id:a.id,type:"p1",mx:e.clientX,my:e.clientY,ox1:a.x1,oy1:a.y1,ox2:a.x2,oy2:a.y2};
                            }}/>
                          <circle cx={a.x2*S} cy={a.y2*S} r={6} fill="#fff" stroke={a.color} strokeWidth={2} style={{pointerEvents:"auto",cursor:"crosshair"}}
                            onMouseDown={(e)=>{e.preventDefault();e.stopPropagation();
                              dragRef.current={kind:"arrow",id:a.id,type:"p2",mx:e.clientX,my:e.clientY,ox1:a.x1,oy1:a.y1,ox2:a.x2,oy2:a.y2};
                            }}/>
                          <line x1={a.x1*S} y1={a.y1*S} x2={a.x2*S} y2={a.y2*S} stroke={a.color} strokeWidth={6} opacity={0.12} style={{pointerEvents:"none"}}/>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Elements */}
              {elements.map(r=>{
                if(hiddenTypes.has(r.type)) return null;
                const isSel=sel===r.id;
                const pw=r.w*S, ph=r.h*S;
                const td = ELEMENT_TYPES[r.type]||{};
                const rot = r.rotation||0;
                return(
                  <div key={r.id}
                    onMouseDown={(e)=>{
                      e.preventDefault();e.stopPropagation();selectElement(r.id);setShowPanel(true);
                      setElements(p=>{const rm=p.find(x=>x.id===r.id);return rm?[...p.filter(x=>x.id!==r.id),rm]:p;});
                      dragRef.current={kind:"element",id:r.id,type:"move",mx:e.clientX,my:e.clientY,ox:r.x,oy:r.y,ow:r.w,oh:r.h};
                    }}
                    style={{position:"absolute",left:r.x*S,top:r.y*S,width:pw,height:ph,
                      background:`${r.color}18`,
                      border:isSel?`2px solid ${r.color}`:`1px solid ${r.color}88`,
                      borderRadius:2,cursor:"grab",userSelect:"none",
                      boxShadow:isSel?`0 0 10px ${r.color}30`:"none",
                      zIndex:isSel?10:5,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                      overflow:"hidden",padding:2,
                      transform:`rotate(${rot}deg)`,transformOrigin:"center center",
                      ...getPatternStyle(r.type)
                    }}>
                    {/* Icon */}
                    {pw>14&&ph>14&&<div style={{fontSize:Math.min(pw/3,ph/2.5,16),lineHeight:1,marginBottom:ph>30?2:0}}>{td.icon||"📦"}</div>}
                    {/* Name */}
                    {pw>30&&ph>18&&<div style={{fontFamily:"'Courier New',monospace",fontSize:Math.min(pw/12,ph/4,10),fontWeight:700,color:r.color,textTransform:"uppercase",textAlign:"center",lineHeight:1.1,overflow:"hidden",textOverflow:"ellipsis",maxWidth:"95%",whiteSpace:ph<30?"nowrap":"normal"}}>{r.name}</div>}
                    {/* Dimensions */}
                    {pw>30&&ph>24&&<div style={{fontFamily:"'Courier New',monospace",fontSize:Math.max(8,Math.min(pw/8,12)),color:`${r.color}88`,marginTop:1,fontWeight:600}}>{r.w}'×{r.h}'</div>}
                    {/* Resize handle */}
                    {isSel&&<div onMouseDown={(e)=>{e.preventDefault();e.stopPropagation();dragRef.current={kind:"element",id:r.id,type:"br",mx:e.clientX,my:e.clientY,ox:r.x,oy:r.y,ow:r.w,oh:r.h};}} style={{position:"absolute",right:-2,bottom:-2,width:10,height:10,background:r.color,borderRadius:2,cursor:"nwse-resize",zIndex:20,border:"1px solid #fff"}}/>}
                  </div>
                );
              })}
            </div>

            {/* Right dim */}
            <div style={{width:24,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",marginLeft:4}}>
              <div style={{position:"absolute",top:0,bottom:0,left:12,width:1,background:"#1a3a5c"}}/>
              <span style={{fontSize:10,color:"#1a3a5c",writingMode:"vertical-rl",whiteSpace:"nowrap",background:"#e0e8f0",padding:"4px 0",zIndex:1}}>{floorH} ft</span>
            </div>
          </div>

          {/* Bottom dim */}
          <div style={{width:floorW*S,marginTop:4}}>
            <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center"}}>
              <div style={{flex:1,height:1,background:"#1a3a5c"}}/><span style={{fontSize:10,color:"#1a3a5c",whiteSpace:"nowrap",padding:"0 6px"}}>{floorW} ft</span><div style={{flex:1,height:1,background:"#1a3a5c"}}/>
            </div>
          </div>
        </div>

        {/* ═══ Collapsible Panel ═══ */}
        <div style={{width:showPanel?280:36,borderLeft:"2px solid #1a3a5c",background:"#f5f9fd",overflowY:"auto",overflowX:"hidden",flexShrink:0,transition:"width 0.2s",display:"flex",flexDirection:"column"}}>
          <button onClick={()=>setShowPanel(!showPanel)} style={{padding:"8px 0",background:"none",border:"none",borderBottom:"1px solid #c5d5e5",color:"#1565c0",fontSize:12,cursor:"pointer",fontFamily:"'Courier New',monospace",fontWeight:700}}>{showPanel?"▸ HIDE":"◂"}</button>

          {showPanel && (
            <div style={{padding:12,flex:1,overflowY:"auto"}}>

              {/* ─── Arrow editor ─── */}
              {selAr ? (
                <div>
                  <div style={{fontSize:9,color:"#1565c0",fontWeight:700,letterSpacing:1,marginBottom:8}}>↗ FLOW ARROW</div>

                  <div style={labelSt}>Label</div>
                  <input value={selAr.label} onChange={e=>setArrows(p=>p.map(a=>a.id===selA?{...a,label:e.target.value}:a))} placeholder="e.g. Material Flow" style={inputSt}/>

                  <div style={labelSt}>Color</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8,alignItems:"center"}}>
                    {ARROW_COLORS.map(c=><div key={c} onClick={()=>setArrows(p=>p.map(a=>a.id===selA?{...a,color:c}:a))} style={{width:20,height:20,borderRadius:3,background:c,cursor:"pointer",border:selAr.color===c?"2px solid #1a3a5c":"1px solid #c5d5e5"}}/>)}
                    <input type="color" value={selAr.color} onChange={e=>setArrows(p=>p.map(a=>a.id===selA?{...a,color:e.target.value}:a))} style={{width:20,height:20,border:"none",borderRadius:3,cursor:"pointer",padding:0,background:"none"}}/>
                  </div>

                  <div style={labelSt}>Style</div>
                  <div style={{display:"flex",gap:4,marginBottom:10}}>
                    {["solid","dashed","dotted"].map(st=>(
                      <button key={st} onClick={()=>setArrows(p=>p.map(a=>a.id===selA?{...a,style:st}:a))}
                        style={{flex:1,padding:"5px 0",background:selAr.style===st?"#1565c018":"#f0f5fa",border:selAr.style===st?"1px solid #1565c0":"1px solid #c5d5e5",borderRadius:4,color:selAr.style===st?"#1565c0":"#7a9ab8",fontSize:10,cursor:"pointer",fontWeight:600,fontFamily:"'Courier New',monospace"}}>
                        {st}
                      </button>
                    ))}
                  </div>

                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <div style={{flex:1}}><div style={labelSt}>Start X</div><input type="number" value={selAr.x1} onChange={e=>setArrows(p=>p.map(a=>a.id===selA?{...a,x1:+e.target.value||0}:a))} style={numInputSt}/></div>
                    <div style={{flex:1}}><div style={labelSt}>Start Y</div><input type="number" value={selAr.y1} onChange={e=>setArrows(p=>p.map(a=>a.id===selA?{...a,y1:+e.target.value||0}:a))} style={numInputSt}/></div>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    <div style={{flex:1}}><div style={labelSt}>End X</div><input type="number" value={selAr.x2} onChange={e=>setArrows(p=>p.map(a=>a.id===selA?{...a,x2:+e.target.value||0}:a))} style={numInputSt}/></div>
                    <div style={{flex:1}}><div style={labelSt}>End Y</div><input type="number" value={selAr.y2} onChange={e=>setArrows(p=>p.map(a=>a.id===selA?{...a,y2:+e.target.value||0}:a))} style={numInputSt}/></div>
                  </div>

                  <div style={{background:"#e8f0f8",borderRadius:5,padding:8,marginBottom:10,border:"1px solid #c5d5e5",fontSize:10,color:"#5a7a9a"}}>
                    Length: {Math.round(Math.sqrt((selAr.x2-selAr.x1)**2+(selAr.y2-selAr.y1)**2))} ft &nbsp;
                    Angle: {Math.round(Math.atan2(selAr.y2-selAr.y1,selAr.x2-selAr.x1)*180/Math.PI)}°
                  </div>

                  <div style={{display:"flex",gap:4}}>
                    <Btn onClick={()=>{const nid=AID();setArrows(p=>[...p,{...selAr,id:nid,x1:selAr.x1+15,y1:selAr.y1+15,x2:selAr.x2+15,y2:selAr.y2+15,label:selAr.label?selAr.label+" copy":""}]);setSelA(nid);}} color="#1565c0">⧉ Copy</Btn>
                    <Btn onClick={()=>{setArrows(p=>p.filter(a=>a.id!==selA));setSelA(null);}} color="#c62828">✕ Delete</Btn>
                  </div>
                </div>

              /* ─── Element editor ─── */
              ) : selE ? (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <div style={{fontSize:22}}>{ELEMENT_TYPES[selE.type]?.icon||"📦"}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#1a3a5c"}}>{selE.name}</div>
                      <div style={{fontSize:9,color:"#7a9ab8"}}>{ELEMENT_TYPES[selE.type]?.label} · {selE.w}'×{selE.h}' = {(selE.w*selE.h).toLocaleString()}sf</div>
                    </div>
                  </div>

                  <div style={labelSt}>Name</div>
                  <input value={selE.name} onChange={e=>setElements(p=>p.map(r=>r.id===sel?{...r,name:e.target.value}:r))} style={inputSt}/>

                  <div style={labelSt}>Type</div>
                  <select value={selE.type} onChange={e=>{const t=e.target.value;setElements(p=>p.map(r=>r.id===sel?{...r,type:t,color:ELEMENT_TYPES[t]?.color||r.color}:r));}} style={{...inputSt,cursor:"pointer"}}>
                    {Object.entries(ELEMENT_TYPES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
                  </select>

                  <div style={labelSt}>Notes</div>
                  <input value={selE.notes||""} placeholder="Optional notes…" onChange={e=>setElements(p=>p.map(r=>r.id===sel?{...r,notes:e.target.value}:r))} style={inputSt}/>

                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <div style={{flex:1}}><div style={labelSt}>X</div><input type="number" value={selE.x} onChange={e=>setElements(p=>p.map(r=>r.id===sel?{...r,x:Math.max(0,Math.min(+e.target.value||0,floorW-r.w))}:r))} style={numInputSt}/></div>
                    <div style={{flex:1}}><div style={labelSt}>Y</div><input type="number" value={selE.y} onChange={e=>setElements(p=>p.map(r=>r.id===sel?{...r,y:Math.max(0,Math.min(+e.target.value||0,floorH-r.h))}:r))} style={numInputSt}/></div>
                  </div>
                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <div style={{flex:1}}><div style={labelSt}>Width</div><input type="number" value={selE.w} onChange={e=>setElements(p=>p.map(r=>r.id===sel?{...r,w:Math.max(2,+e.target.value||2)}:r))} style={numInputSt}/></div>
                    <div style={{flex:1}}><div style={labelSt}>Height</div><input type="number" value={selE.h} onChange={e=>setElements(p=>p.map(r=>r.id===sel?{...r,h:Math.max(2,+e.target.value||2)}:r))} style={numInputSt}/></div>
                  </div>

                  <div style={labelSt}>Rotation</div>
                  <div style={{display:"flex",gap:4,marginBottom:10,alignItems:"center"}}>
                    {[0,90,180,270].map(deg=>(
                      <button key={deg} onClick={()=>setElements(p=>p.map(r=>r.id===sel?{...r,rotation:deg}:r))}
                        style={{flex:1,padding:"5px 0",background:(selE.rotation||0)===deg?"#1565c018":"#f0f5fa",border:(selE.rotation||0)===deg?"1px solid #1565c0":"1px solid #c5d5e5",borderRadius:4,color:(selE.rotation||0)===deg?"#1565c0":"#7a9ab8",fontSize:10,cursor:"pointer",fontWeight:600,fontFamily:"'Courier New',monospace"}}>
                        {deg}°
                      </button>
                    ))}
                  </div>

                  <div style={{background:"#e8f0f8",borderRadius:5,padding:8,marginBottom:10,border:"1px solid #c5d5e5"}}>
                    <div style={{fontFamily:"'Courier New',monospace",fontSize:20,fontWeight:700,color:"#1a3a5c"}}>{(selE.w*selE.h).toLocaleString()}</div>
                    <div style={{fontSize:9,color:"#7a9ab8"}}>sq ft ({((selE.w*selE.h)/total*100).toFixed(1)}%)</div>
                  </div>

                  <div style={labelSt}>Color</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:10,alignItems:"center"}}>
                    {Object.values(ELEMENT_TYPES).map(td=><div key={td.color} onClick={()=>setElements(p=>p.map(r=>r.id===sel?{...r,color:td.color}:r))} style={{width:18,height:18,borderRadius:3,background:td.color,cursor:"pointer",border:selE.color===td.color?"2px solid #1a3a5c":"1px solid #c5d5e5"}}/>)}
                    <input type="color" value={selE.color} onChange={e=>setElements(p=>p.map(r=>r.id===sel?{...r,color:e.target.value}:r))} style={{width:18,height:18,border:"none",borderRadius:3,cursor:"pointer",padding:0,background:"none"}}/>
                  </div>

                  <div style={{display:"flex",gap:4}}>
                    <Btn onClick={()=>{const nid=ID();setElements(p=>[...p,{...selE,id:nid,x:selE.x+10,y:selE.y+10,name:selE.name+" copy"}]);setSel(nid);}} color="#1565c0">⧉ Copy</Btn>
                    <Btn onClick={()=>{setElements(p=>p.filter(r=>r.id!==sel));setSel(null);}} color="#c62828">✕ Delete</Btn>
                  </div>
                </div>

              ) : (
                <div style={{color:"#7a9ab8",fontSize:10,lineHeight:1.9}}>
                  Click element or arrow to edit<br/>
                  <code style={{color:"#1565c0",background:"#e8f0f8",padding:"1px 4px",borderRadius:2}}>Ctrl+Z/Y</code> Undo/Redo<br/>
                  <code style={{color:"#1565c0",background:"#e8f0f8",padding:"1px 4px",borderRadius:2}}>Ctrl+C/V</code> Copy/Paste<br/>
                  <code style={{color:"#1565c0",background:"#e8f0f8",padding:"1px 4px",borderRadius:2}}>Del</code> Delete selected<br/>
                  <code style={{color:"#1565c0",background:"#e8f0f8",padding:"1px 4px",borderRadius:2}}>R</code> Rotate selected
                </div>
              )}

              {/* ─── Layer Visibility ─── */}
              <div style={{marginTop:12,borderTop:"1px solid #c5d5e5",paddingTop:8}}>
                <div style={{fontSize:8,color:"#7a9ab8",letterSpacing:1.5,marginBottom:6,fontWeight:700}}>LAYER VISIBILITY</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {Object.entries(ELEMENT_TYPES).map(([key,td])=>{
                    const hidden = hiddenTypes.has(key);
                    const count = elements.filter(e=>e.type===key).length;
                    return(
                      <div key={key} onClick={()=>toggleLayerType(key)} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 4px",borderRadius:3,cursor:"pointer",background:hidden?"#f0f0f0":"transparent",opacity:hidden?0.4:1}}>
                        <div style={{width:14,height:14,borderRadius:2,background:hidden?"#ccc":td.color+"33",border:`1px solid ${hidden?"#bbb":td.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8}}>{hidden?"":"✓"}</div>
                        <span style={{fontSize:9,color:hidden?"#999":"#5a7a9a",flex:1}}>{td.icon} {td.label}</span>
                        <span style={{fontSize:8,color:"#aab8c8"}}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── Element list ─── */}
              <div style={{marginTop:12,borderTop:"1px solid #c5d5e5",paddingTop:8}}>
                <div style={{fontSize:8,color:"#7a9ab8",letterSpacing:1.5,marginBottom:4,fontWeight:700}}>ALL ELEMENTS ({elements.length})</div>
                {elements.filter(r=>!hiddenTypes.has(r.type)).map(r=>(
                  <div key={r.id} onClick={()=>{selectElement(r.id);}} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 4px",borderRadius:3,cursor:"pointer",background:sel===r.id?"#1565c015":"transparent",marginBottom:1}}>
                    <span style={{fontSize:9}}>{ELEMENT_TYPES[r.type]?.icon||"📦"}</span>
                    <div style={{flex:1,fontSize:9,color:sel===r.id?"#1565c0":"#5a7a9a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
                    <div style={{fontSize:7,color:"#aab8c8"}}>{r.w}'×{r.h}'</div>
                  </div>
                ))}
                {arrows.length>0 && (
                  <>
                    <div style={{fontSize:8,color:"#7a9ab8",letterSpacing:1.5,marginTop:8,marginBottom:4,fontWeight:700}}>FLOW ARROWS ({arrows.length})</div>
                    {arrows.map(a=>(
                      <div key={a.id} onClick={()=>selectArrow(a.id)} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 4px",borderRadius:3,cursor:"pointer",background:selA===a.id?"#1565c015":"transparent",marginBottom:1}}>
                        <div style={{width:12,height:2,background:a.color,borderRadius:1,flexShrink:0}}/>
                        <div style={{flex:1,fontSize:9,color:selA===a.id?"#1565c0":"#5a7a9a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.label||"Arrow"}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Footer Branding ═══ */}
      <div style={{padding:"4px 12px",borderTop:"1px solid #c5d5e5",background:"#e8f0f8",display:"flex",alignItems:"center",justifyContent:"center",gap:6,flexShrink:0}}>
        <span style={{fontSize:9,color:"#9ab0c8",fontFamily:"'Courier New',monospace"}}>Powered by</span>
        <span style={{fontSize:9,color:"#1565c0",fontWeight:700,fontFamily:"'Courier New',monospace"}}>Pandora AI</span>
        <span style={{fontSize:9,color:"#9ab0c8",fontFamily:"'Courier New',monospace"}}>·</span>
        <a href="https://www.hexaiot.com.my" target="_blank" rel="noopener noreferrer" style={{fontSize:9,color:"#1565c0",fontFamily:"'Courier New',monospace",textDecoration:"none"}}>www.hexaiot.com.my</a>
      </div>
    </div>
  );
}
