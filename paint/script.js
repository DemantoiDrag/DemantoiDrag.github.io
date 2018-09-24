document.body.onload = function () {
    setTimeout(function () {
        var preloader = document.getElementById('page-preloader');
        if (!preloader.classList.contains('done')) {
            preloader.classList.add('done');
        }
    }, 1000)
}

var settin = document.getElementById("settings"),
    radius = document.getElementById("radius"),
    color = document.getElementsByTagName("input")[1],
    clear = document.getElementById("clear"),
    save = document.getElementById("save"),
    play = document.getElementById("play"),
    img = document.getElementById("img"),
    brush = document.getElementById("brush"),
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    ctx.beginPath();
    coords = [];
};

img.onclick = function () {
    document.getElementById("file-input").click();
    document.getElementById("file-input").onchange = function () {
        canvas.style.background =
            "url(" +
            window.URL.createObjectURL(
                document.getElementById("file-input").files[0]
            ) +
            ") center no-repeat";
    };
};

function download_img(el) {
    var image = canvas.toDataURL("image/png");
    el.href = image;
};


save.onclick = function () {
    localStorage.setItem("coords", JSON.stringify(coords));
};

play.onclick = function () {
    isPainting = false;
    coords = JSON.parse(localStorage.getItem("coords"));
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.globalCompositeOperation = "source-over";

    var timer = setInterval(function () {
        if (!coords.length) {
            clearInterval(timer);
            ctx.beginPath();
            isPainting = true;
            return;
        }
        var crd = coords.shift(),
            e = {
                clientX: crd["0"],
                clientY: crd["1"],
                radius: crd["2"],
                color: crd["3"]
            };
        ctx.globalCompositeOperation=crd["4"]
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
    }, 30);
};

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
        canvas.style.cursor="url(https://diamondragon2003.github.io/Pen/pencil.png) 0 25, auto";

brush.onclick = function () {
    if (brush_Pen == 'pencil') {
        canvas.style.cursor="url(https://diamondragon2003.github.io/Pen/eraser.png) 0 25, auto";
        brush.src="https://diamondragon2003.github.io//Pen/eraser.svg";
        brush_Pen = 'eraser';
    } else if (brush_Pen == 'eraser') {
        canvas.style.cursor="url(https://diamondragon2003.github.io/Pen/pencil.png) 0 25, auto";
        brush.src="https://diamondragon2003.github.io//Pen/pencil.svg";
        brush_Pen = 'pencil';
    }
}

function paint(e) {
    if (isPainting) {
        if (brush_Pen == 'eraser') {
            ctx.globalCompositeOperation = "destination-out";
        } else if (brush_Pen == 'pencil'){
            ctx.globalCompositeOperation = "source-over";
        }

        ctx.fillStyle = color.value;
        ctx.strokeStyle = color.value;
        coords.push([e.clientX, e.clientY, radius.value, color.value,ctx.globalCompositeOperation]);
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
