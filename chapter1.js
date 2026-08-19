/*
   OTHER SIDE — CAPITULO 1 / A JORNADA AO VIVO
   Camada de expansão: preserva a engine original e adiciona progressão,
   save versionado, UI responsiva, objetivos e um antagonista original.
*/
(function(){
    "use strict";

    const SAVE_KEY="os_chapter1_save_v3";
    const SAVE_TMP="os_chapter1_save_v3_tmp";
    const SAVE_VERSION=3;
    const LEVEL_COUNT=100;

    const clampLocal=(v,a,b)=>
        v<a?a:(v>b?b:v);

    const levelThemes=[
        "LABORATORIO",
        "CEMITERIO",
        "MEMORIAS",
        "FIOS",
        "AGUA MORTA",
        "TORRE DO SILENCIO",
        "ECO PROFUNDO",
        "PORTA SEM NOME"
    ];

    const chapterCatalog=[
        {
            id:1,
            title:"A JORNADA AO VIVO",
            subtitle:"LABORATORIO / CEMITERIO",
            active:true
        },
        {
            id:2,
            title:"A CIDADE DEBAIXO",
            subtitle:"AGUA MORTA / NPCS",
            active:false
        },
        {
            id:3,
            title:"O NOME QUE FALTA",
            subtitle:"ARQUIVOS / MEMORIAS",
            active:false
        },
        {
            id:4,
            title:"O LADO DE CA",
            subtitle:"RETORNO / LIMIAR",
            active:false
        }
    ];

    const chapter1Levels=[];

    for(let i=1;i<=LEVEL_COUNT;i++){
        let type="memory";
        let goal="RECUPERE AS MEMORIAS";

        if(i===1){
            type="key";
            goal="ENCONTRE A CHAVE";
        }else if(i===2){
            type="bridge";
            goal="ATRAVESSE O CEMITERIO";
        }else if(i%11===0){
            type="warden";
            goal="NAO DEIXE O VIGIA TE VER";
        }else if(i%7===0){
            type="echo";
            goal="SIGA O ECO AZUL";
        }else if(i%5===0){
            type="gate";
            goal="ABRA O PORTAO";
        }

        chapter1Levels.push({
            id:i,
            theme:levelThemes[(i-1)%levelThemes.length],
            type,
            goal,
            seed:(i*1103515245+12345)>>>0,
            memories:i===1?0:i===2?0:1+(i%3)
        });
    }

    class SaveSystem{
        constructor(){
            this.data=this.defaults();
            this.load();
        }

        defaults(){
            return{
                version:SAVE_VERSION,
                chapter:1,
                currentLevel:1,
                unlockedLevel:1,
                completedLevels:[],
                checkpoint:null,
                totalDeaths:0,
                lastReason:"novo",
                savedAt:0
            };
        }

        normalize(raw){
            const d=this.defaults();

            if(!raw||typeof raw!=="object")
                return d;

            d.currentLevel=clampLocal(
                Number(raw.currentLevel)||1,
                1,
                LEVEL_COUNT
            );

            d.unlockedLevel=clampLocal(
                Number(raw.unlockedLevel)||d.currentLevel,
                1,
                LEVEL_COUNT
            );

            d.completedLevels=
                Array.isArray(raw.completedLevels)
                ?raw.completedLevels
                    .map(Number)
                    .filter(n=>n>=1&&n<=LEVEL_COUNT)
                    .filter((n,i,a)=>a.indexOf(n)===i)
                :[];

            d.checkpoint=
                raw.checkpoint&&typeof raw.checkpoint==="object"
                ?{
                    level:clampLocal(Number(raw.checkpoint.level)||1,1,LEVEL_COUNT),
                    map:Number(raw.checkpoint.map)||1,
                    x:Number(raw.checkpoint.x)||0
                }
                :null;

            d.totalDeaths=Math.max(
                0,
                Number(raw.totalDeaths)||0
            );

            d.lastReason=String(
                raw.lastReason||"restaurado"
            ).slice(0,40);

            d.savedAt=Number(raw.savedAt)||0;
            d.version=SAVE_VERSION;
            return d;
        }

        load(){
            try{
                const raw=
                    localStorage.getItem(SAVE_KEY)||
                    localStorage.getItem(SAVE_TMP);

                if(raw)
                    this.data=this.normalize(
                        JSON.parse(raw)
                    );
            }catch(e){
                this.data=this.defaults();
            }

            return this.data;
        }

        commit(reason){
            this.data=this.normalize(this.data);
            this.data.lastReason=String(reason||"auto").slice(0,40);
            this.data.savedAt=Date.now();

            try{
                const raw=JSON.stringify(this.data);
                localStorage.setItem(SAVE_TMP,raw);
                localStorage.setItem(SAVE_KEY,raw);
                localStorage.removeItem(SAVE_TMP);
            }catch(e){}
        }

        clear(){
            this.data=this.defaults();

            try{
                localStorage.removeItem(SAVE_KEY);
                localStorage.removeItem(SAVE_TMP);
            }catch(e){}
        }
    }

    const save=new SaveSystem();

    function currentStage(){
        if(!game)
            return chapter1Levels[0];

        return chapter1Levels[
            clampLocal(
                Number(game.chapterLevel)||save.data.currentLevel||1,
                1,
                LEVEL_COUNT
            )-1
        ];
    }

    function autoSave(reason){
        if(!game)
            return;

        const stage=
            clampLocal(
                Number(game.chapterLevel)||save.data.currentLevel||1,
                1,
                LEVEL_COUNT
            );

        save.data.currentLevel=stage;
        save.data.unlockedLevel=Math.max(
            save.data.unlockedLevel,
            stage
        );

        if(game.sound)
            save.data.musicOn=!!game.sound.musicOn;

        if(game.player){
            save.data.checkpoint={
                level:stage,
                map:game.level||1,
                x:Math.round(game.player.x||0)
            };
        }

        save.commit(reason);
        game._saveFlash=75;
        game._saveReason=reason||"auto";
    }

    function markComplete(stage,reason){
        const n=clampLocal(Number(stage)||1,1,LEVEL_COUNT);

        if(save.data.completedLevels.indexOf(n)<0)
            save.data.completedLevels.push(n);

        save.data.completedLevels.sort((a,b)=>a-b);
        save.data.unlockedLevel=Math.max(
            save.data.unlockedLevel,
            Math.min(LEVEL_COUNT,n+1)
        );

        save.data.currentLevel=
            Math.min(
                LEVEL_COUNT,
                Math.max(1,n+1)
            );

        save.commit(reason||"nivel-concluido");
    }

    function levelLabel(){
        const n=clampLocal(Number(game.chapterLevel)||1,1,LEVEL_COUNT);
        return "NIVEL "+n+"/"+LEVEL_COUNT;
    }

    function actionAvailable(g){
        if(!g||g.state!=="game"||!g.player)
            return false;

        if(g.prompt)
            return true;

        if(g.level===2&&g.map){
            if(g.player.hiding)
                return true;

            const cl=g.map.getClosetAt&&
                g.map.getClosetAt(g.player.cx,g.player.cy);

            return !!(cl&&!cl.occupied);
        }

        return false;
    }

    function setTouchLayout(g){
        g.btns={
            l:{x:6,y:148,w:30,h:25},
            r:{x:40,y:148,w:30,h:25},
            r2:{x:104,y:151,w:28,h:21},
            a:{x:232,y:148,w:34,h:25},
            j:{x:276,y:144,w:38,h:29}
        };
    }

    function drawBox(b,pressed){
        ctx.save();
        ctx.globalAlpha=pressed?.24:.08;
        ctx.fillStyle=pressed?"#c4d4ff":"#8a98c5";
        ctx.fillRect(b.x,b.y,b.w,b.h);
        ctx.globalAlpha=pressed?.85:.42;
        ctx.fillStyle=pressed?"#d9e4ff":"#8997c9";
        ctx.fillRect(b.x,b.y,b.w,1);
        ctx.fillRect(b.x,b.y+b.h-1,b.w,1);
        ctx.fillRect(b.x,b.y,1,b.h);
        ctx.fillRect(b.x+b.w-1,b.y,1,b.h);
        ctx.restore();
    }

    function drawArrow(x,y,dir,col){
        ctx.fillStyle=col;

        for(let r=0;r<11;r++){
            const width=11-Math.abs(5-r);

            if(dir<0){
                ctx.fillRect(
                    x+Math.abs(5-r),
                    y+r,
                    width,
                    1
                );
            }else{
                ctx.fillRect(x,y+r,width,1);
            }
        }
    }

    function drawUp(x,y,col){
        ctx.fillStyle=col;

        for(let r=0;r<11;r++){
            const width=Math.max(1,Math.round(r/10*13));
            ctx.fillRect(
                x+Math.floor((13-width)/2),
                y+r,
                width,
                1
            );
        }
    }

    function drawPromptButton(g){
        const b=g.btns.a;
        const pressed=g.touchFlags().a;
        drawBox(b,pressed);
        drawText(
            "E",
            b.x+b.w/2,
            b.y+8,
            1,
            pressed?"#000":"#fff",
            "center"
        );
    }

    function drawTouchExpanded(){
        const g=this;
        setTouchLayout(g);

        if(!g.isTouch&&navigator.maxTouchPoints<1)
            return;

        const f=g.touchFlags();
        const b=g.btns;
        const pale="#f3f5ff";
        const dark="#05050b";

        drawBox(b.l,f.l);
        drawArrow(
            b.l.x+10,
            b.l.y+7,
            -1,
            f.l?dark:pale
        );

        drawBox(b.r,f.r);
        drawArrow(
            b.r.x+9,
            b.r.y+7,
            1,
            f.r?dark:pale
        );

        drawBox(b.j,f.j);
        drawUp(
            b.j.x+12,
            b.j.y+9,
            f.j?dark:pale
        );

        if(g.level===2){
            drawBox(b.r2,f.r2);
            drawText(
                "R",
                b.r2.x+b.r2.w/2,
                b.r2.y+7,
                1,
                f.r2?dark:"#8fd2ff",
                "center"
            );
        }

        if(actionAvailable(g))
            drawPromptButton(g);

        ctx.save();
        ctx.globalAlpha=.42;
        ctx.fillStyle="#1b1b31";
        ctx.fillRect(290,2,28,13);
        ctx.globalAlpha=.75;
        drawText("MENU",294,5,1,"#aab4df");
        ctx.restore();
    }

    function promptForStage(g){
        if(!g||g.level!==2||!g.map||!g.player)
            return null;

        if(g.player.hiding){
            return{
                kind:"closet",
                x:g.player.cx,
                y:g.player.cy,
                label:"SAIR"
            };
        }

        const stage=currentStage();
        const nodes=g.map.memoryNodes||[];
        let near=null;

        for(const n of nodes){
            if(n.taken)
                continue;

            if(Math.hypot(n.x-g.player.cx,n.y-g.player.cy)<22){
                near=n;
                break;
            }
        }

        if(near){
            return{
                kind:"memory",
                x:near.x,
                y:near.y,
                node:near,
                label:"ECO"
            };
        }

        const cl=g.map.getClosetAt&&
            g.map.getClosetAt(g.player.cx,g.player.cy);

        if(cl&&!cl.occupied){
            return{
                kind:"closet",
                x:cl.x+cl.w/2,
                y:cl.y+cl.h/2,
                closet:cl,
                label:"ESCONDER"
            };
        }

        return null;
    }

    function makeMemoryNodes(g,stage){
        const count=stage.memories||0;
        const nodes=[];
        const span=stage.seed%3;
        const base=[
            220+span*12,
            520+span*16,
            820+span*20,
            1080+span*12,
            1270+span*8
        ];

        for(let i=0;i<count;i++){
            nodes.push({
                x:base[i%base.length],
                y:128-(i%2)*18,
                taken:false,
                pulse:(stage.seed+i*17)%60,
                id:i
            });
        }

        g.map.memoryNodes=nodes;
    }

    function configureStage(g){
        const stage=currentStage();
        g.chapterStage=stage;
        g.chapterGoal=stage.goal;
        g._chapterActive=true;
        g._stageToastShown=false;
        g._memoryToastShown=false;
        g._gateBlockedShown=false;
        g._lastCheckpoint=false;
        g._wardenAlertT=0;
        g._revealT=0;
        g.echoNPC={
            x:g.level===1?460:690,
            y:g.level===1?142:136
        };
        g.wireWarden={
            active:stage.type==="warden"||stage.id>=4,
            x:stage.id%2?1170:760,
            y:112,
            dir:-1,
            t:0,
            visible:false,
            alert:false
        };

        if(g.map&&g.level===2){
            makeMemoryNodes(g,stage);

            if(stage.id>=3&&stage.id%3===0){
                for(const c of g.map.candles||[])
                    c.lit=(c.x+stage.seed)%3!==0;
            }
        }

        autoSave("inicio-"+stage.id);
    }

    function collectMemory(g,node){
        if(!node||node.taken)
            return;

        node.taken=true;
        g.chapterMemories=(g.chapterMemories||0)+1;

        g.sound.keyS();
        g.sound.messageBeep();

        if(g.particles&&g.particles.sparkle)
            g.particles.sparkle(node.x,node.y,14,"#9fe7ff");

        g.glitch=8;
        g.toast(
            "MEMORIA RECUPERADA "+
            g.chapterMemories+"/"+
            (g.map.memoryNodes||[]).length
        );

        if(g.sound.setIntense)
            g.sound.setIntense(true);

        autoSave("memoria-"+node.id);
    }

    function memoriesComplete(g){
        const nodes=g.map&&g.map.memoryNodes;

        if(!nodes||!nodes.length)
            return true;

        return nodes.every(n=>n.taken);
    }

    function updateWarden(g){
        const w=g.wireWarden;

        if(!w||!w.active||!g.player||g.state!=="game")
            return;

        w.t++;
        w.visible=
            w.t>100&&
            (w.t%520)>70&&
            (w.t%520)<280;

        if(!w.visible){
            w.alert=false;
            return;
        }

        const p=g.player;
        const target=p.cx-70;
        const dx=target-w.x;

        w.dir=dx>=0?1:-1;
        w.x+=clampLocal(dx*.006,-.35,.35);

        const distance=Math.abs(p.cx-w.x);

        if(
            distance<92&&
            !p.hiding&&
            g.invis.active<=0
        ){
            if(!w.alert){
                w.alert=true;
                g._wardenAlertT=40;
                g.sound.alertS();
                g.toast("O VIGIA DE FIO ESTA PERTO...");
                g.sound.setIntense(true);
            }
        }

        if(g._wardenAlertT>0)
            g._wardenAlertT--;

        if(
            distance<18&&
            !p.hiding&&
            g.invis.active<=0&&
            g._wardenAlertT<=0
        ){
            w.visible=false;
            w.t=0;
            w.alert=false;
            g.triggerGameOver("O VIGIA TE ENCONTROU...");
        }
    }

    function drawMemoryNodes(g){
        if(g.level!==2||!g.map||!g.map.memoryNodes)
            return;

        ctx.save();
        ctx.translate(-g.camera.sx,g.camera.sy);

        for(const n of g.map.memoryNodes){
            if(n.taken)
                continue;

            const pulse=
                1+
                Math.sin((g.t+n.pulse)*.08)*.2;

            ctx.globalAlpha=.2;
            ctx.fillStyle="#6de6ff";
            ctx.fillRect(n.x-7,n.y-7,14,14);
            ctx.globalAlpha=.9;
            ctx.fillStyle="#b7f5ff";
            ctx.fillRect(n.x-2,n.y-5,4,10);
            ctx.fillRect(n.x-5,n.y-2,10,4);
            ctx.globalAlpha=.45;
            ctx.fillStyle="#74aaff";
            ctx.fillRect(n.x-5-pulse,n.y+7,10+pulse*2,1);
        }

        const w=g.wireWarden;

        if(w&&w.visible){
            const x=Math.round(w.x);
            const y=Math.round(w.y);
            ctx.globalAlpha=w.alert?.95:.58;
            ctx.fillStyle="#050509";
            ctx.fillRect(x-5,y-34,10,32);
            ctx.fillRect(x-9,y-28,18,16);
            ctx.fillRect(x-13,y-18,26,3);
            ctx.fillStyle=w.alert?"#ff5a5a":"#7d92b8";
            ctx.fillRect(x+(w.dir>0?3:-5),y-25,2,2);
            ctx.fillStyle="#11111b";
            ctx.fillRect(x-14,y-6,3,18);
            ctx.fillRect(x+11,y-6,3,18);
            ctx.fillRect(x-7,y,4,18);
            ctx.fillRect(x+3,y,4,18);
            ctx.strokeStyle="#1d1d2d";
            ctx.lineWidth=1;
            for(let i=0;i<4;i++){
                ctx.beginPath();
                ctx.moveTo(x-12+i*8,y-32);
                ctx.lineTo(x-20+i*13,y-48-(g.t+i*7)%8);
                ctx.stroke();
            }
        }

        ctx.restore();
        ctx.globalAlpha=1;
    }

    function drawSceneAtmosphere(g){
        if(g.state!=="game")
            return;

        ctx.save();

        const pulse=.5+.5*Math.sin(g.t*.018);
        const top=ctx.createLinearGradient(0,0,0,132);
        top.addColorStop(0,"rgba(4,4,18,.18)");
        top.addColorStop(.45,"rgba(30,28,70,.04)");
        top.addColorStop(1,"rgba(0,0,0,0)");
        ctx.fillStyle=top;
        ctx.fillRect(0,0,W,132);

        ctx.globalAlpha=.1+.04*pulse;
        ctx.fillStyle=g.level===2?"#91a7dc":"#7b5f86";
        for(let i=0;i<5;i++){
            const y=50+i*16+(g.camera.x*.025+i*3)%9;
            ctx.fillRect(0,y,W,1);
        }

        ctx.globalAlpha=.12;
        ctx.fillStyle="#03030b";
        ctx.fillRect(0,0,10,132);
        ctx.fillRect(W-10,0,10,132);

        if(g.level===1){
            ctx.globalAlpha=.18;
            ctx.strokeStyle="#3c345b";
            ctx.lineWidth=1;
            for(let i=0;i<4;i++){
                const x=((i*83-g.camera.x*.12)%W+W)%W;
                ctx.beginPath();
                ctx.moveTo(x,4);
                ctx.lineTo(x+12,24);
                ctx.lineTo(x+4,47);
                ctx.stroke();
            }
            ctx.globalAlpha=.08+.05*pulse;
            ctx.fillStyle="#e04b58";
            ctx.fillRect(0,102,W,2);
        }else{
            ctx.globalAlpha=.16+.04*pulse;
            ctx.fillStyle="#94a7d0";
            for(let i=0;i<4;i++){
                const x=((i*101-g.camera.x*.08)%W+W)%W;
                ctx.fillRect(x,118+(i%2)*5,48,1);
            }
            ctx.globalAlpha=.1;
            ctx.fillStyle="#06101c";
            ctx.fillRect(0,124,W,7);
        }

        ctx.restore();
        ctx.globalAlpha=1;
    }

    function drawNPCEnhancements(g){
        if(g.state!=="game")
            return;

        ctx.save();

        if(g.level===2&&g.skels){
            for(const s of g.skels){
                const sx=Math.round(s.x-g.camera.x);
                const sy=Math.round(s.y);

                if(sx<-20||sx>W+20)
                    continue;

                ctx.globalAlpha=s.state==="alert"?.62:.24;
                ctx.fillStyle=s.state==="alert"?"#ff5b6e":"#b7c7e7";
                ctx.fillRect(sx-4,sy-22,2,2);
                ctx.fillRect(sx+2,sy-22,2,2);
                ctx.globalAlpha=.16;
                ctx.fillRect(sx-7,sy-13,14,1);
            }
        }

        if(g.echoNPC){
            const ex=Math.round(g.echoNPC.x-g.camera.x);
            const ey=Math.round(g.echoNPC.y);

            if(ex>-24&&ex<W+24){
                ctx.globalAlpha=.12+.08*Math.sin(g.t*.05);
                const ghost=g.ghost.frames.idle[
                    Math.floor(g.t/10)%6
                ];
                ctx.drawImage(ghost,ex-8,ey-16,16,16);
                ctx.globalAlpha=.3;
                ctx.fillStyle="#82dfff";
                ctx.fillRect(ex-1,ey-8,2,2);
                ctx.fillRect(ex+4,ey-8,2,2);
            }
        }

        ctx.restore();
        ctx.globalAlpha=1;
    }

    function drawCinematicBeat(g){
        if(!g._revealT||g._revealT<=0)
            return;

        const fade=Math.min(1,g._revealT/18);
        ctx.save();
        ctx.globalAlpha=.78*fade;
        ctx.fillStyle="#03030a";
        ctx.fillRect(0,35,W,42);
        ctx.fillRect(0,38,12,36);
        ctx.fillRect(W-12,38,12,36);
        ctx.globalAlpha=.95*fade;
        drawTextSh("A PORTA LEMBRA SEU NOME",W/2,47,1,"#dfe7ff","center");
        drawText("E O VIGIA RESPONDE",W/2,61,1,"#a96579","center");
        ctx.restore();
        ctx.globalAlpha=1;
    }

    function drawStageHUD(g){
        if(g.state!=="game")
            return;

        const stage=currentStage();
        const nodes=g.map&&g.map.memoryNodes||[];
        const done=nodes.filter(n=>n.taken).length;

        ctx.fillStyle="#0a0a18";
        ctx.globalAlpha=.8;
        ctx.fillRect(6,16,106,12);
        ctx.globalAlpha=1;

        drawText(levelLabel(),10,19,1,"#b9c8f4");

        if(nodes.length){
            drawText(
                "MEM "+done+"/"+nodes.length,
                70,
                19,
                1,
                done===nodes.length?"#9ff":"#7fa5ca"
            );
        }

        if(g._saveFlash>0){
            g._saveFlash--;
            drawText(
                "AUTO-SAVE",
                W-8,
                19,
                1,
                "#aab8d8",
                "right"
            );
        }

        if(g._wardenAlertT>0){
            ctx.globalAlpha=.9;
            drawText(
                "!",
                W/2,
                18,
                2,
                "#ff7777",
                "center"
            );
            ctx.globalAlpha=1;
        }

        void stage;
    }

    function isMobilePortrait(g){
        return(
            (g.isTouch||navigator.maxTouchPoints>0)&&
            innerWidth<innerHeight&&
            innerWidth<720
        );
    }

    function drawOrientationOverlay(g){
        if(!isMobilePortrait(g))
            return;

        ctx.save();
        ctx.fillStyle="#05050b";
        ctx.globalAlpha=.92;
        ctx.fillRect(0,0,W,H);
        ctx.globalAlpha=1;

        ctx.strokeStyle="#8fa4e6";
        ctx.lineWidth=2;
        ctx.strokeRect(119,54,82,52);
        ctx.strokeRect(126,62,68,36);
        ctx.fillStyle="#8fa4e6";
        ctx.fillRect(152,48,16,3);

        drawTextSh("GIRE O CELULAR",W/2,118,2,"#fff","center");
        drawText("JOGUE EM PAISAGEM",W/2,139,1,"#9aa8d0","center");
        drawText("A VISAO FICA LIVRE",W/2,154,1,"#69769c","center");
        ctx.restore();
    }

    function drawChapterCard(g){
        ctx.fillStyle="#060611";
        ctx.fillRect(0,0,W,H);

        for(let y=0;y<H;y+=4){
            ctx.fillStyle=y%8===0?"#0c0c22":"#090916";
            ctx.fillRect(0,y,W,4);
        }

        ctx.globalAlpha=.18;
        ctx.fillStyle="#6f8aff";
        ctx.fillRect(26,35,1,112);
        ctx.fillRect(293,27,1,126);
        ctx.globalAlpha=1;

        const ghost=game.ghost.frames.idle[
            Math.floor(g.t/8)%6
        ];

        ctx.globalAlpha=.75;
        ctx.drawImage(ghost,142,68,36,36);
        ctx.globalAlpha=1;

        drawTextSh(
            g._chapterCardMode==="reset"
            ?"APAGAR SALVAMENTO?"
            :"A JORNADA AO VIVO",
            W/2,
            24,
            2,
            g._chapterCardMode==="reset"?"#ff9a9a":"#fff",
            "center"
        );

        if(g._chapterCardMode==="reset"){
            drawText(
                "TODO O PROGRESSO VAI ZERAR",
                W/2,
                56,
                1,
                "#d88",
                "center"
            );
            drawText(
                "ENTER: SIM",
                W/2,
                104,
                2,
                "#fff",
                "center"
            );
            drawText(
                "ESC: NAO",
                W/2,
                126,
                2,
                "#9aa4c9",
                "center"
            );
        }else{
            const stage=currentStage();
            drawText(
                "CAPITULO 1 / 100 NIVEIS",
                W/2,
                56,
                1,
                "#9aa4c9",
                "center"
            );
            drawText(
                "NIVEL "+stage.id+": "+stage.theme,
                W/2,
                78,
                2,
                "#bfeaff",
                "center"
            );
            drawText(
                stage.goal,
                W/2,
                100,
                1,
                "#d8d9ee",
                "center"
            );
            drawText(
                g.isTouch?"TOQUE PARA CONTINUAR":"ENTER: CONTINUAR",
                W/2,
                142,
                1,
                "#7d8bb5",
                "center"
            );
        }

        g.t++;
    }

    function drawMenuExpanded(){
        const g=this;
        const t=g.t;
        const grad=ctx.createLinearGradient(0,0,0,H);
        grad.addColorStop(0,"#070713");
        grad.addColorStop(.55,"#11132b");
        grad.addColorStop(1,"#05050b");
        ctx.fillStyle=grad;
        ctx.fillRect(0,0,W,H);

        for(const p of g.menu.parts){
            ctx.fillStyle=p.c;
            ctx.globalAlpha=.42;
            ctx.fillRect(Math.round(p.x),Math.round(p.y),1,1);
        }
        ctx.globalAlpha=1;

        const gf=g.ghost.frames.idle[Math.floor(t/8)%6];
        ctx.globalAlpha=.28;
        ctx.drawImage(gf,136,22+Math.sin(t*.05)*2,48,48);
        ctx.globalAlpha=1;

        drawTextSh("OTHER SIDE",62,10,4,"#fff");
        g.menu.drips.draw("#ff4444",2);

        const progress=save.data.completedLevels.length;
        drawText(
            "JORNADA "+progress+"/"+LEVEL_COUNT,
            W-8,
            12,
            1,
            "#8f9bc1",
            "right"
        );

        const labels=[
            "CONTINUAR",
            "NOVA JORNADA",
            "CAPITULOS",
            "CONFIG",
            "DIRETOR"
        ];

        for(let i=0;i<labels.length;i++){
            const y=60+i*19;
            const selected=g.menu.sel===i;

            ctx.fillStyle=selected?"#dfe5ff":"#292c4a";
            ctx.fillRect(62,y,196,16);

            if(selected){
                ctx.fillStyle="#fff";
                ctx.fillRect(64,y+2,192,12);
            }

            drawText(
                labels[i],
                W/2+4,
                y+5,
                1,
                selected?"#05050b":"#aab6dc",
                "center"
            );

            if(selected&&((t>>3)%2)===0)
                drawText(">",68,y+5,1,selected?"#05050b":"#fff");
        }

        drawText(
            g.isTouch?"TOQUE PARA ESCOLHER":"W/S: NAVEGAR   ENTER: OK",
            W/2,
            170,
            1,
            "#65709b",
            "center"
        );
    }

    function drawChaptersScreen(g){
        const t=g.t;
        const grad=ctx.createLinearGradient(0,0,W,H);
        grad.addColorStop(0,"#03030a");
        grad.addColorStop(.55,"#0b0b1d");
        grad.addColorStop(1,"#020207");
        ctx.fillStyle=grad;
        ctx.fillRect(0,0,W,H);

        ctx.globalAlpha=.22;
        ctx.fillStyle="#777ea8";
        for(let i=0;i<9;i++){
            const x=18+i*37+(t%18);
            ctx.fillRect(x,34+(i%3)*5,1,112);
        }
        ctx.globalAlpha=.1;
        ctx.fillStyle="#ff4e5e";
        ctx.fillRect(0,151,W,1);
        ctx.globalAlpha=1;

        ctx.fillStyle="#0b0b18";
        ctx.fillRect(130,26,60,18);
        ctx.fillStyle="#b9c6ef";
        ctx.fillRect(142,30,36,2);
        ctx.fillRect(142,35,25,2);
        ctx.fillStyle="#e65c67";
        ctx.fillRect(166,35,12,2);

        drawTextSh("CAPITULOS",W/2,10,3,"#fff","center");
        drawText(
            "JORNADA "+save.data.completedLevels.length+"/"+LEVEL_COUNT,
            W-8,
            13,
            1,
            "#8f9bc1",
            "right"
        );

        for(let i=0;i<chapterCatalog.length;i++){
            const c=chapterCatalog[i];
            const y=47+i*25;
            const selected=g.chapterSel===i;

            ctx.globalAlpha=selected?.95:.66;
            ctx.fillStyle=selected?"#dfe4ff":"#21233c";
            ctx.fillRect(28,y,264,20);
            ctx.globalAlpha=1;

            if(selected){
                ctx.fillStyle="#fff";
                ctx.fillRect(30,y+2,260,16);
            }

            drawText(
                c.id+"  "+c.title,
                40,
                y+5,
                1,
                selected?"#06060c":"#a5afd1"
            );

            drawText(
                c.active?c.subtitle:"BLOQUEADO",
                284,
                y+5,
                1,
                selected?"#121326":"#6d7397",
                "right"
            );

            if(!c.active){
                ctx.globalAlpha=.6;
                ctx.fillStyle="#e15b65";
                ctx.fillRect(35,y+14,5,3);
                ctx.fillRect(36,y+12,3,2);
                ctx.globalAlpha=1;
            }
        }

        drawText(
            g.isTouch?"TOQUE PARA ABRIR":"W/S: NAVEGAR   ENTER: ABRIR   ESC: VOLTAR",
            W/2,
            169,
            1,
            "#65709b",
            "center"
        );

        if(((t>>4)%2)===0){
            ctx.globalAlpha=.35;
            drawText("NAO OLHE PARA TRAS",W/2,157,1,"#8f5262","center");
            ctx.globalAlpha=1;
        }
    }

    function updateChapters(g,P){
        g.t++;
        g.chapterSel=((g.chapterSel%chapterCatalog.length)+chapterCatalog.length)%chapterCatalog.length;

        if(P.up){
            g.chapterSel=(g.chapterSel+chapterCatalog.length-1)%chapterCatalog.length;
            g.sound.click();
        }

        if(P.down){
            g.chapterSel=(g.chapterSel+1)%chapterCatalog.length;
            g.sound.click();
        }

        if(P.back){
            g.sound.back();
            g.toMenu();
            return;
        }

        if(P.ok){
            const selected=chapterCatalog[g.chapterSel];

            if(selected.active){
                g._chapterCardMode="info";
                g.state="chapterCard";
                g._chapterCardT=0;
                g.sound.confirm();
            }else{
                g.sound.denyS();
                g.toastQ=[];
                g.toast("ESTE CAPITULO AINDA ESTA DORMINDO...");
            }
        }
    }

    function chaptersTap(g,p){
        for(let i=0;i<chapterCatalog.length;i++){
            const y=47+i*25;
            if(g.inRect(p,{x:20,y:y-2,w:280,h:24})){
                g.chapterSel=i;
                updateChapters(g,{up:false,down:false,back:false,ok:true});
                return;
            }
        }
    }

    function drawSettingsExpanded(){
        const g=this;
        ctx.fillStyle="#080817";
        ctx.fillRect(0,0,W,H);

        drawTextSh("CONFIG",W/2,18,3,"#fff","center");

        const rows=[
            "MUSICA: "+(g.sound.musicOn?"LIGADA":"DESLIGADA"),
            "TELA CHEIA",
            "APAGAR SALVAMENTO",
            "VOLTAR"
        ];

        for(let i=0;i<rows.length;i++){
            const y=48+i*24;
            const selected=g.menu.setSel===i;
            ctx.fillStyle=selected?"#e4e8ff":"#272a48";
            ctx.fillRect(42,y,236,20);

            if(selected){
                ctx.fillStyle="#fff";
                ctx.fillRect(44,y+2,232,16);
            }

            drawText(
                rows[i],
                W/2+3,
                y+7,
                1,
                selected?"#05050b":"#aab6dc",
                "center"
            );
        }

        drawText(
            "PROGRESSO: "+save.data.completedLevels.length+"/"+LEVEL_COUNT,
            W/2,
            151,
            1,
            "#8290b6",
            "center"
        );

        drawText(
            g.isTouch?"TOQUE PARA SELECIONAR":"W/S: NAVEGAR   ESC: VOLTAR",
            W/2,
            169,
            1,
            "#65709b",
            "center"
        );
    }

    function beginNewJourney(g){
        save.clear();
        g.chapterLevel=1;
        g.menu.sel=0;
        g.state="ghostIntro";
        g.ghostIntro={active:true,t:0,assembled:false};
        g.sound.assembleS();
        autoSave("nova-jornada");
    }

    function continueJourney(g){
        const n=clampLocal(save.data.currentLevel,1,LEVEL_COUNT);
        g.chapterLevel=n;

        if(n<=1){
            g.state="ghostIntro";
            g.ghostIntro={active:true,t:0,assembled:false};
            g.sound.assembleS();
        }else{
            g.startLevel2();
        }
    }

    function menuActivateExpanded(){
        const g=this;
        g.sound.confirm();

        switch(g.menu.sel){
            case 0:
                continueJourney(g);
                break;
            case 1:
                beginNewJourney(g);
                break;
            case 2:
                g.chapterSel=0;
                g.state="chapters";
                g.sound.stingS();
                break;
            case 3:
                g.state="settings";
                g.menu.setSel=0;
                break;
            default:
                g.state="director";
                break;
        }
    }

    function setActivateExpanded(){
        const g=this;
        const s=g.menu.setSel;

        if(s===0){
            g.sound.setMusic(!g.sound.musicOn);
            save.data.musicOn=!!g.sound.musicOn;
            save.commit("musica");
            g.sound.click();
        }else if(s===1){
            g.sound.confirm();
            g.toggleFS();
        }else if(s===2){
            g._chapterCardMode="reset";
            g.state="chapterCard";
            g._chapterCardT=0;
            g.sound.alertS();
        }else{
            g.sound.back();
            g.toMenu();
        }
    }

    function menuTapExpanded(p){
        const g=this;
        const labels=5;

        for(let i=0;i<labels;i++){
            const y=60+i*19;

            if(g.inRect(p,{x:50,y:y-2,w:220,h:20})){ 
                if(g.menu.sel!==i)
                    g.sound.click();
                g.menu.sel=i;
                g.menuActivate();
                return;
            }
        }
    }

    function setTapExpanded(p){
        const g=this;

        for(let i=0;i<4;i++){
            const y=48+i*24;
            if(g.inRect(p,{x:35,y:y-2,w:250,h:24})){ 
                g.menu.setSel=i;
                g.setActivate();
                return;
            }
        }
    }

    function customStep(g,P){
        g.t++;
        g.sound.tick();

        if(g.state==="chapterCard"){
            if(g._chapterCardMode==="reset"){
                if(P.back){
                    g.sound.back();
                    g.toMenu();
                }else if(P.ok){
                    save.clear();
                    g.chapterLevel=1;
                    g.sound.confirm();
                    g.toastQ=[];
                    g.toastCur=null;
                    g.state="menu";
                    g.menu.sel=0;
                    g._saveFlash=0;
                }
            }else if(P.any||P.ok){
                g.sound.confirm();
                continueJourney(g);
            }
        }
    }

    function updateStageBefore(g,P){
        if(g.state!=="game"||g.level!==2||!g.map)
            return;

        g.prompt=promptForStage(g);

        if(
            P.act&&
            g.prompt&&
            g.prompt.kind==="memory"
        ){
            collectMemory(g,g.prompt.node);
            P.act=false;
        }
    }

    function updateStageAfter(g){
        if(g.state!=="game"||g.level!==2||!g.map)
            return;

        if(g._revealT>0)
            g._revealT--;

        if(g.time&&g.time%360===0)
            g.sound.windAmbient();

        if(g.time&&g.time%540===0)
            g.sound.dripSound();

        g.prompt=promptForStage(g);
        updateWarden(g);

        const nodes=g.map.memoryNodes||[];
        const required=nodes.length>0;

        if(
            required&&
            !memoriesComplete(g)&&
            g.map.gate&&
            (g.map.gate.opening||g.map.gate.open>0)
        ){
            g.map.gate.open=0;
            g.map.gate.opening=false;

            if(!g._gateBlockedShown){
                g._gateBlockedShown=true;
                g.toast("A MEMORIA AINDA ESTA PRESA...");
                g.sound.lockedS();
            }
        }

        if(
            required&&
            memoriesComplete(g)&&
            !g._memoryToastShown
        ){
            g._memoryToastShown=true;
            g._revealT=110;
            g.toast("TODAS AS MEMORIAS RESPIRAM. O PORTAO CEDE.");
            g.sound.openS();
            g.sound.setIntense(false);
            autoSave("memorias-completas");
        }

        if(g.cp2&&!g._lastCheckpoint){
            g._lastCheckpoint=true;
            autoSave("checkpoint");
        }

        if(g.time&&g.time%900===0)
            autoSave("intervalo");
    }

    function handleEscapeReturn(g,wasEscaped,hadInput){
        if(!wasEscaped)
            return;

        const returnedToMenu=
            g.state==="menu"||
            (g.state!=="escaped"&&g.state!=="game");

        if(!returnedToMenu&&!hadInput)
            return;

        if(g._escapeCounted)
            return;

        g._escapeCounted=true;
        const stage=g.chapterLevel||1;
        markComplete(stage,"nivel-concluido");
        g._chapterCompletedStage=stage;
        g.chapterLevel=Math.min(LEVEL_COUNT,stage+1);
        autoSave("proximo-nivel");
    }

    function install(){
        const g=
            window.game||
            (typeof game!=="undefined"?game:null);

        if(!g)
            return;
        g.saveSystem=save;
        g.chapterLevels=chapter1Levels;
        g.chapterLevel=save.data.currentLevel||1;
        g._chapterActive=false;
        g._saveFlash=0;
        g._escapeCounted=false;
        setTouchLayout(g);

        const originalStartGame=g.startGame;
        g.startGame=function(){
            g.chapterLevel=1;
            originalStartGame.call(g);
            configureStage(g);
        };

        const originalStartLevel2=g.startLevel2;
        g.startLevel2=function(){
            originalStartLevel2.call(g);
            g.chapterLevel=clampLocal(
                Number(g.chapterLevel)||2,
                2,
                LEVEL_COUNT
            );
            g._escapeCounted=false;
            configureStage(g);
        };

        const originalMenuActivate=g.menuActivate;
        g.menuActivate=menuActivateExpanded;
        g._originalMenuActivate=originalMenuActivate;

        g.menuTap=menuTapExpanded;
        g.setTap=setTapExpanded;
        g.setActivate=setActivateExpanded;

        g.menu.items=5;
        g.menu.settingsItems=4;
        g.chapterSel=0;

        const originalUpdMenu=g.updMenu;
        g.updMenu=function(P){
            originalUpdMenu.call(g,P);
            g.menu.sel=((g.menu.sel%5)+5)%5;

            if(P.up||P.down){
                g.menu.sel=((g.menu.sel%5)+5)%5;
            }
        };

        const originalUpdSettings=g.updSettings;
        g.updSettings=function(P){
            originalUpdSettings.call(g,P);
            g.menu.setSel=((g.menu.setSel%4)+4)%4;
        };

        const originalStepF=g.stepF;
        g.stepF=function(dt){
            if(g.state==="chapterCard"){
                const P=g.consumePressed();
                customStep(g,P);
                return;
            }

            if(g.state==="chapters"){
                const P=g.consumePressed();
                updateChapters(g,P);
                return;
            }

            const wasEscaped=g.state==="escaped";
            const hadInput=Object.keys(g.pressedObj).length>0;

            if(g.state==="game"&&g.level===2)
                g._escapeCounted=false;

            originalStepF.call(g,dt);
            handleEscapeReturn(g,wasEscaped,hadInput);
        };

        const originalUpdGame=g.updGame;
        g.updGame=function(P,dt){
            updateStageBefore(g,P);
            originalUpdGame.call(g,P,dt);
        };

        const originalUpdGame2=g.updGame2;
        g.updGame2=function(P,dt){
            updateStageBefore(g,P);
            originalUpdGame2.call(g,P,dt);
            updateStageAfter(g);
        };

        const originalRetry=g.retryLevel;
        g.retryLevel=function(){
            save.data.totalDeaths++;
            autoSave("morte");
            g._escapeCounted=false;
            originalRetry.call(g);
        };

        const originalTrigger=g.triggerGameOver;
        g.triggerGameOver=function(reason){
            save.data.totalDeaths++;
            autoSave("perigo");
            originalTrigger.call(g,reason);
        };

        const originalDoInteract=g.doInteract;
        g.doInteract=function(a){
            originalDoInteract.call(g,a);
            autoSave("interacao");
        };

        const originalDrawTouch=g.drawTouch;
        g.drawTouch=drawTouchExpanded;
        g._originalDrawTouch=originalDrawTouch;

        const originalTouchFlags=g.touchFlags;
        g.touchFlags=function(){
            const f=originalTouchFlags.call(g);

            if(!actionAvailable(g))
                f.a=false;

            if(g.level!==2)
                f.r2=false;

            return f;
        };

        const originalDrawMenu=g.drawMenu;
        g.drawMenu=drawMenuExpanded;
        g._originalDrawMenu=originalDrawMenu;

        const originalDrawSettings=g.drawSettings;
        g.drawSettings=drawSettingsExpanded;
        g._originalDrawSettings=originalDrawSettings;

        const originalDrawGame1=g.drawGame1;
        g.drawGame1=function(){
            originalDrawGame1.call(g);
            drawStageHUD(g);
        };

        const originalDrawGame2=g.drawGame2;
        g.drawGame2=function(){
            originalDrawGame2.call(g);
            drawMemoryNodes(g);
            drawStageHUD(g);
        };

        const originalDraw=g.draw;
        g.draw=function(){
            if(g.state==="chapterCard"){
                drawChapterCard(g);
                drawOrientationOverlay(g);
                return;
            }

            if(g.state==="chapters"){
                drawChaptersScreen(g);
                drawOrientationOverlay(g);
                return;
            }

            originalDraw.call(g);
            drawOrientationOverlay(g);
        };

        const customPointer=e=>{
            if(g.state==="chapters"){
                e.preventDefault();
                g.sound.unlock();
                chaptersTap(g,g.toXY(e));
                return;
            }

            if(g.state!=="chapterCard")
                return;

            e.preventDefault();
            g.sound.unlock();

            if(g._chapterCardMode==="reset"){
                if(e.clientX<innerWidth*.35){
                    save.clear();
                    g.chapterLevel=1;
                    g.state="menu";
                    g.sound.confirm();
                }else{
                    g.sound.back();
                    g.toMenu();
                }
            }else{
                continueJourney(g);
            }
        };

        canvas.addEventListener(
            "pointerdown",
            customPointer,
            {passive:false}
        );

        const mobileGesture=()=>{
            if(!g.isTouch||g._mobileFsTried)
                return;

            g._mobileFsTried=true;

            if(document.fullscreenElement)
                return;

            const root=document.documentElement;
            const req=
                root.requestFullscreen||
                root.webkitRequestFullscreen;

            if(req){
                try{
                    const result=req.call(root);
                    if(result&&result.catch)
                        result.catch(()=>{});
                }catch(e){}
            }
        };

        canvas.addEventListener(
            "pointerdown",
            mobileGesture,
            {passive:false}
        );

        addEventListener("resize",()=>{
            setTouchLayout(g);
            if(typeof fit==="function")
                fit();
        });

        if(screen.orientation&&screen.orientation.addEventListener)
            screen.orientation.addEventListener(
                "change",
                ()=>setTouchLayout(g)
            );

        addEventListener("beforeunload",()=>autoSave("saida"));
        addEventListener("pagehide",()=>autoSave("pagina"));

        if(g.sound&&save.data.musicOn!==undefined)
            g.sound.setMusic(!!save.data.musicOn);

        if(save.data.currentLevel>1)
            g.toast("PROGRESSO RESTAURADO: NIVEL "+save.data.currentLevel);
    }

    if(typeof game!=="undefined")
        install();

    window.OTHER_SIDE_CHAPTER1={
        save,
        levels:chapter1Levels,
        version:SAVE_VERSION
    };
})();
