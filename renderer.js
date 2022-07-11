let nextBtn, previousBtn, closeBtn, clearBtn, brushBtn;
let buttonElement;
let canvas;
let ctx;
let selLabel;
let brushSizes = [2,4,8,12,24];
let currentBrush = 0;

let cSel = 0;
const state = {
  mousedown: false
};

    // ===================
// == Configuration ==
// ===================
let lineWidth = brushSizes[currentBrush];
const halfLineWidth = lineWidth / 2;
const fillStyle = '#FFF';
const strokeStyle = '#FFF';
const shadowColor = '#FFF';
const shadowBlur = lineWidth / 4;
const scale = 1;

let fingers = [];

var tests;
window.addEventListener('DOMContentLoaded',()=>{
    window.api.send("toMain", "getFile");
    window.api.receive("fromMain", (data) => {
        console.log(data.tests);
        tests = data.tests;
    });

})

window.addEventListener('load', () => {

    nextBtn = document.getElementById("next");
    nextBtn.addEventListener('click',next)
    previousBtn = document.getElementById("previous");
    previousBtn.addEventListener('click',previous)
    //Close application button use ipc
    closeBtn = document.getElementById("close");
    closeBtn.addEventListener('click',close)
    clearBtn = document.getElementById("clear")
    clearBtn.addEventListener('click',clear)
    selLabel = document.getElementById("testNum");
    brushBtn = document.getElementById("incBrush");
    brushBtn.addEventListener('click',incBrush);
    buttonElement = document.getElementById("buttons");


    canvas = document.getElementById("main");
    ctx = canvas.getContext('2d');

    ctx.canvas.width  = window.innerWidth*scale;
    ctx.canvas.height = window.innerHeight*scale;


    // canvas.addEventListener('mousedown', handleWritingStart);
    // canvas.addEventListener('mousemove', handleWritingInProgress);
    // canvas.addEventListener('mouseup', handleDrawingEnd);
    // canvas.addEventListener('mouseout', handleDrawingEnd);

    canvas.addEventListener('touchstart', handleWritingStart);
    canvas.addEventListener('touchmove', handleWritingInProgress);
    canvas.addEventListener('touchend', handleDrawingEnd);


    
});


function handleWritingStart(event) {
  event.preventDefault();
  buttonElement.style.display = "none";
  

  fingers=[];
  ctx.beginPath();
  for(let i=0; i<event.touches.length;i++)
  {
    
    // fingers[i]["state"] = true;
    fingers.push(event.touches[i]);
    fingers[i].drawing=true;
    
    const mousePos = getMosuePositionOnCanvas(event.touches[i]);
    ctx.beginPath();
    // console.log(event.touches);

   ctx.moveTo(mousePos.x, mousePos.y);
   ctx.lineCap = 'round';
   ctx.lineWidth = lineWidth;
   ctx.strokeStyle = strokeStyle;
   ctx.shadowColor = shadowColor;
   ctx.shadowBlur = shadowBlur;
   ctx.fill();
   fingers[i].previousPos = getMosuePositionOnCanvas(fingers[i]);

  }
  
  state.mousedown = true;
}

function handleWritingInProgress(event) {
  event.preventDefault();
  
      for(let i=0; i<event.touches.length;i++){
            if(fingers[i].drawing)
            {
                const mousePos = getMosuePositionOnCanvas(event.touches[i]);
                fingers[i].drawing=true;
                ctx.moveTo(fingers[i].previousPos.x, fingers[i].previousPos.y);
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();
                fingers[i].previousPos = getMosuePositionOnCanvas(event.touches[i]);
            
            }
            
    }

  
}

function handleDrawingEnd(event) {

    event.preventDefault();
    // fingers[event.changedTouches[0].identifier].drawing = false;
    // fingers.pop();
    ctx.stroke();
    if(event.touches.length != 0)
    {
        // console.log(event);
        for(let i =0; i<event.touches.length; i++)
        {
            // fingers[i] = event.touches[i];
            fingers[i].previousPos = getMosuePositionOnCanvas(event.touches[i]);
        }

    }
    buttonElement.style.display = "flex";
}

function handleClearButtonClick(event) {
  event.preventDefault();
  
  clearCanvas();
}

function getMosuePositionOnCanvas(event) {
    // console.log(event);
  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;
  const { offsetLeft, offsetTop } = event.target;
  const canvasX = clientX - offsetLeft;
  const canvasY = clientY - offsetTop;

  return { x: canvasX*scale, y: canvasY*scale };
}

function fixPosition(e, gCanvasElement) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
    } 
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    return {x: x, y:y};
}


function next(){
    
    if(cSel == tests.length-1)
    {
        cSel = 0;
        console.log(cSel);
        handleTest(tests[cSel]);
    }else{
        cSel++;
        console.log(cSel);
        handleTest(tests[cSel]);
    }
};

function previous(){
    if(cSel == 0)
    {
        cSel = tests.length-1;
        console.log(cSel);
        handleTest(tests[cSel]);
    }else{
        cSel--;
        console.log(cSel);
        handleTest(tests[cSel]);
    }
};

function close(){
    window.api.send("toMain", "exit");
};

function clear(){
    cSel=0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fingers =[];
};

function setColor(value)
{
    ctx.fillStyle = colorArray[value];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};


function handleTest(test){
    selLabel.innerHTML = cSel+1;
    switch (test.type){
        case "solid":
            ctx.fillStyle = test.colors[0];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
            
        case "striped":

            switch(test.direction){
                case "vertical":
                    var stripeWidth = Math.round(canvas.width/test.colors.length);
                    console.log("striped height: "+ stripeWidth);
                    for(var i=0; i<=test.colors.length;i++)
                    {   
                        ctx.fillStyle = test.colors[i];
                        ctx.fillRect(i*stripeWidth,0,stripeWidth, canvas.height);
                    }
                    break;

                case "horizontal":
                    var stripeHeight = Math.round(canvas.height/test.colors.length);
                    console.log("striped height: "+ stripeHeight);
                    for(var i=0; i<test.colors.length;i++)
                    {   

                        ctx.fillStyle = test.colors[i];
                        ctx.fillRect(0,i*stripeHeight, canvas.width, canvas.height);
                    }

                    break;
            }
            break;

        case "gradient":
            switch(test.direction){
                case "vertical":
                    var grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    grd.addColorStop(0, test.colors[0]);
                    grd.addColorStop(1, test.colors[1]);

                    // Fill with gradient
                    ctx.fillStyle = grd;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    break;

                case "horizontal":
                    var grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
                    grd.addColorStop(0, test.colors[0]);
                    grd.addColorStop(1, test.colors[1]);

                    // Fill with gradient
                    ctx.fillStyle = grd;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    break;
            }
            break;
    }
}

function incBrush(){
    if(currentBrush == brushSizes.length-1)
    {
        currentBrush = 0;
    }else{
        currentBrush++;
    }
    brushBtn.innerHTML = "Brush " + brushSizes[currentBrush] + "px";
    lineWidth=brushSizes[currentBrush]


}