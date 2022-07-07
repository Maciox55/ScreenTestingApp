let nextBtn, previousBtn, closeBtn, clearBtn;
let canvas;
let ctx;
let selLabel;

let cSel = 0;

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