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

function download_img(el) {
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

    if (document.getElementById('asCoords').checked) {
        if (coords.length != 0) {
            filename = fileSaveName.value + ".pngc";
            type = "text/plain";
            data = JSON.stringify(coords);
            var file = new Blob([data], {
                type: type
            });
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename);
            else { // Others
                var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }
    } else {
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


}



loadimg.onclick = function () {
    document.getElementById("file-limg").click();



    document.getElementById('file-limg').addEventListener('change', readFile, false);

    function readFile(evt) {
        var files = evt.target.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            scords = JSON.parse(event.target.result.toString());
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 50;
            ctx.beginPath();
            coords = JSON.parse(JSON.stringify(scords));
            console.log(JSON.parse(JSON.stringify(scords)))
            while (true) {
                if (!scords.length) {
                    ctx.beginPath();
                    isPainting = true;
                    color.disabled = !isPainting;
                    break;
                }
                var crd = scords.shift(),
                    e = {
                        clientX: crd["0"],
                        clientY: crd["1"],
                        radius: crd["2"],
                        color: crd["3"]
                    };
                ctx.globalCompositeOperation = crd["4"]
                ctx.fillStyle = e.color;
                ctx.strokeStyle = e.color;
                ctx.lineWidth = e.radius * 2;

                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(e.clientX, e.clientY, e.radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(e.clientX, e.clientY);
            }
        }
        reader.readAsText(file)
    };
}

var scords;
window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
};

if (device.mobile()) {
    canvas.addEventListener("touchstart", touchstart);
    canvas.addEventListener("touchend", handleEnd);
    canvas.addEventListener("touchmove", moveHand);

    function touchstart(e) {
        var exp = {
            clientX: e.changedTouches[0].pageX,
            clientY: e.changedTouches[0].pageY
        };
        paint(exp);
        mouseIsDown = true;
    }

    function handleEnd() {
        ctx.beginPath();
        mouseIsDown = false;
        coords.push("mouseup");
    }

    function moveHand(e) {
        var exp = {
            clientX: e.changedTouches[0].pageX,
            clientY: e.changedTouches[0].pageY
        };
        if (mouseIsDown) paint(exp);
    }
} else {
    canvas.onmousedown = function (e) {
        paint(e);
        mouseIsDown = true;
    };
    canvas.onmouseup = function () {
        ctx.beginPath();
        mouseIsDown = false;
        coords.push("mouseup");
    };

    canvas.onmousemove = function (e) {
        if (mouseIsDown) paint(e);
    };
}
ctx.lineWidth = radius.value * 2;
canvas.style.cursor = "url(https://diamondragon2003.github.io/Pen/pencil.png) 0 25, auto";



brush.onclick = function () {
    if (isPainting) {
        if (brush_Pen == 'pencil') {
            canvas.style.cursor = "url(https://diamondragon2003.github.io/Pen/eraser.png) 0 16, auto";
            brush.src = "https://diamondragon2003.github.io//Pen/eraser.svg";
            brush_Pen = 'eraser';
        } else if (brush_Pen == 'eraser') {
            canvas.style.cursor = "url(https://diamondragon2003.github.io/Pen/pencil.png) 0 25, auto";
            brush.src = "https://diamondragon2003.github.io//Pen/pencil.svg";
            brush_Pen = 'pencil';
        }
    }
}

function paint(e) {
    if (isPainting) {
        if (brush_Pen == 'eraser') {
            ctx.globalCompositeOperation = "destination-out";
        } else if (brush_Pen == 'pencil') {
            ctx.globalCompositeOperation = "source-over";
        }

        ctx.fillStyle = localStorage.getItem('color');
        ctx.strokeStyle = localStorage.getItem('color');
        coords.push([e.clientX, e.clientY, radius.value, localStorage.getItem('color'), ctx.globalCompositeOperation]);
        ctx.lineWidth = radius.value * 2;
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, radius.value, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);
    }
}
