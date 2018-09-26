document.body.onload = function () {
    setTimeout(function () {
        var preloader = document.getElementById('page-preloader');
        if (!preloader.classList.contains('done')) {
            preloader.classList.add('done');
        }
    }, 1)
}

var settin = document.getElementById("settings"),
    radius = document.getElementById("radius"),
    color = document.getElementById("color"),
    clear = document.getElementById("clear"),
    img = document.getElementById("img"),
    brush = document.getElementById("brush"),
    saveWindow = document.getElementById("saveWindow"),
    loadimg = document.getElementById("loadimg"),
    brush_Pen = 'pencil',
    isPainting = true,
    coords = [];

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

ctx.fillStyle = color.value;
var mouseIsDown = false;

if (localStorage.getItem("color") != null) {
    document.getElementById("color").value = localStorage.getItem("color");
} else {
    document.getElementById("color").value = "black";
}
if (localStorage.getItem("radius") != null) {
    document.getElementById("radius").value = localStorage.getItem("radius");
} else {
    document.getElementById("radius").value = 10;
}

clear.onclick = function () {
    if (isPainting) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 50;
        ctx.beginPath();
        coords = [];
    }
};

img.onclick = function () {
    if (isPainting) {
        document.getElementById("file-input").click();
        document.getElementById("file-input").onchange = function () {
            canvas.style.background =
                "url(" +
                window.URL.createObjectURL(
                    document.getElementById("file-input").files[0]
                ) +
                ") center no-repeat";
        };
    }
};
saveWindow.style.display = 'none';
var srcCanvas;
var saveImg = document.getElementById('out_color');
var SaveImgBut = document.getElementById('SaveImg');

function download_img() {
    if (saveWindow.style.display == 'block') {
        saveWindow.style.display = 'none';
        isPainting = true;
    } else {
        saveWindow.style.display = 'block';
        isPainting = false;
        saveImg.src = canvas.toDataURL();
    }
    color.disabled = !isPainting;
};
var isOptical = document.getElementById('isOptical');
var fileSaveName = document.getElementById('fileSaveName');

SaveImgBut.onclick = function () {
    if (fileSaveName.value == '') {
        fileSaveName.value = "Paint"
    }


    srcCanvas = canvas;
    destinationCanvas = document.createElement("canvas");
    destinationCanvas.width = srcCanvas.width;
    destinationCanvas.height = srcCanvas.height;

    destCtx = destinationCanvas.getContext('2d');
    if (!isOptical.checked) {
        destCtx.fillStyle = resImg;
        destCtx.fillRect(0, 0, srcCanvas.width, srcCanvas.height);
    }
    destCtx.drawImage(srcCanvas, 0, 0);
    if (document.getElementById('asJpg').checked) {
        SaveImgBut.download = fileSaveName.value + ".jpg";
        SaveImgBut.href = destinationCanvas.toDataURL("image/jpg");
    } else {
        SaveImgBut.download = fileSaveName.value + ".png";
        SaveImgBut.href = destinationCanvas.toDataURL("image/png");
    }
}






loadimg.onclick = function () {
    document.getElementById("file-limg").click();



    document.getElementById('file-limg').addEventListener('change', readFile, false);

    function readFile() {
        if (this.files && this.files[0]) {
            var FR = new FileReader();
            FR.onload = function (e) {
                var img = new Image();
                img.addEventListener("load", function () {
                    if (window.innerWidth <= this.width) {
                        canvas.style.marginLeft = '0px';
                    } else {
                        canvas.style.marginLeft = ((window.innerWidth - this.width) / 2) + 'px';
                    }
                    if (window.innerHeight - 50 <= this.height) {
                        canvas.style.marginTop = '0px';
                    } else {
                        canvas.style.marginTop = ((window.innerHeight - 50 - this.height) / 2) + 'px';
                    }
                    canvas.width = this.width;
                    canvas.height = this.height;
                    ctx.drawImage(img, 0, 0);
                });
                img.src = e.target.result;
            };
            FR.readAsDataURL(this.files[0]);
        }
    };
}

var scords,
    isPipe = false;

if (device.mobile()) {
    canvas.addEventListener("touchstart", touchstart);
    canvas.addEventListener("touchend", handleEnd);
    canvas.addEventListener("touchmove", moveHand);

    function touchstart(e) {
        if (!isPipe) {
            var exp = {
                offsetX: e.touches[0].pageX - e.touches[0].target.offsetLeft,
                offsetY: e.touches[0].pageY - e.touches[0].target.offsetTop
            };
            paint(exp);
            mouseIsDown = true;
        }
    }

    function handleEnd(e) {
        if (!isPipe) {
            ctx.beginPath();
            mouseIsDown = false;
            coords.push("mouseup");
        }else{
            offsetX= e.changedTouches[0].pageX - e.changedTouches[0].target.offsetLeft;
            offsetY= e.changedTouches[0].pageY - e.changedTouches[0].target.offsetTop;

            x = offsetX == undefined ? e.layerX : offsetX;
            y = offsetY == undefined ? e.layerY : offsetY;
            var imageData = ctx.getImageData(x, y, 1, 1);
            var pixel = imageData.data;
            var dColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
            color.value = dColor;
            localStorage.setItem('color',dColor);
        }
    }

    function moveHand(e) {
        if (!isPipe) {
            var exp = {
                offsetX: e.touches[0].pageX - e.touches[0].target.offsetLeft,
                offsetY: e.touches[0].pageY - e.touches[0].target.offsetTop
            };
            if (mouseIsDown) paint(exp);
        }
    }
} else {
    canvas.onmousedown = function (e) {
        if (!isPipe) {
            paint(e);
            mouseIsDown = true;
        }
    };
    canvas.onmouseup = function (e) {
        if (!isPipe) {
            ctx.beginPath();
            mouseIsDown = false;
            coords.push("mouseup");
        }else{
        x = e.offsetX == undefined ? e.layerX : e.offsetX;
        y = e.offsetY == undefined ? e.layerY : e.offsetY;
 
        var imageData = ctx.getImageData(x, y, 1, 1);
        var pixel = imageData.data;
        var dColor = rgbToHex(pixel[0], pixel[1], pixel[2]);
        color.value = dColor;
        localStorage.setItem('color',dColor);
        }
    };

    canvas.onmousemove = function (e) {
        if (!isPipe) {
            if (mouseIsDown) paint(e);
        } else {
        }
    };
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



ctx.lineWidth = radius.value * 2;
canvas.style.cursor = "url(https://diamondragon2003.github.io/Pen/pencil.png) 0 25, auto";



brush.onclick = function () {
    if (isPainting) {
        if (brush_Pen == 'pencil') {
            canvas.style.cursor = "url(https://diamondragon2003.github.io/Pen/eraser.png) 0 16, auto";
            brush.src = "https://diamondragon2003.github.io//Pen/eraser.svg";
            brush_Pen = 'eraser';
            isPipe = false;
        } else if (brush_Pen == 'eraser') {
            canvas.style.cursor = "url(https://diamondragon2003.github.io/Pen/pipette.png) 0 25, auto";
            brush.src = "https://diamondragon2003.github.io//Pen/pipette.svg";
            brush_Pen = 'pipe';
            isPipe = true;
        } else if (brush_Pen == 'pipe') {
            canvas.style.cursor = "url(https://diamondragon2003.github.io/Pen/pencil.png) 0 25, auto";
            brush.src = "https://diamondragon2003.github.io//Pen/pencil.svg";
            brush_Pen = 'pencil';
            isPipe = false;
        }
    }
}

function paint(e) {
    var x = e.offsetX == undefined ? e.layerX : e.offsetX;
    var y = e.offsetY == undefined ? e.layerY : e.offsetY;

    if (isPainting) {
        if (brush_Pen == 'eraser') {
            ctx.globalCompositeOperation = "destination-out";
        } else if (brush_Pen == 'pencil') {
            ctx.globalCompositeOperation = "source-over";
        }

        ctx.fillStyle = localStorage.getItem('color');
        ctx.strokeStyle = localStorage.getItem('color');
        coords.push([x, y, radius.value, localStorage.getItem('color'), ctx.globalCompositeOperation]);
        ctx.lineWidth = radius.value * 2;
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, radius.value, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}
