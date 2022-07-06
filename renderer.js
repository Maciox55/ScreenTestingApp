let nextBtn, previousBtn, closeBtn, clearBtn;
let canvas;
let ctx;

let colorArray = ["#F00", "#0F0","#00F"]
let cSel = 0;

window.addEventListener('DOMContentLoaded', () => {
    nextBtn = document.getElementById("next");
    nextBtn.addEventListener('click',next)
    previousBtn = document.getElementById("previous");
    previousBtn.addEventListener('click',previous)
    //Close application button use ipc
    closeBtn = document.getElementById("close");
    closeBtn.addEventListener('click',close)
    clearBtn = document.getElementById("clear")
    clearBtn.addEventListener('click',clear)

    canvas = document.getElementById("main");
    ctx = canvas.getContext('2d');

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    var mousedown = false;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.5;
    canvas.onmousedown = function(e) {
        var pos = fixPosition(e, canvas);
        mousedown = true;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        return false;
    };

    canvas.onmousemove = function(e) {
        var pos = fixPosition(e, canvas);
        if (mousedown) {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    };

    canvas.onmouseup = function(e) {
        mousedown = false;
    };
});

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
    console.log("next pressed");
    if(cSel == colorArray.length)
    {
        cSel = 0;
        setColor(cSel);
    }else{
        cSel++;
        setColor(cSel);
    }
    
};

function previous(){
    console.log("previous pressed")
};
function close(){
    console.log("close pressed")
    
};
function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setColor(value)
{
    ctx.fillStyle = colorArray[value];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

