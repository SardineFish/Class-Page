window.addEventListener("load", load);
function load()
{
    initBGMask();
    initCircle();
}
function initBGMask()
{
    var canvas = document.getElementById("canvas-mask");
    var width = parseInt(getComputedStyle(canvas).width);
    var height = parseInt(getComputedStyle(canvas).height);

    canvas.height = height;
    canvas.width = width;
    var rectWrapHeight = 220;
    var lineCount = 5;
    var rectData = [
        {
            width: 500,
            height: 200,
            x: 100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: -100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: 150,
            pos: { x: 0, y: 0 }
        }
    ];
    var rectTransform = [
        {
            width: 500,
            height: 200,
            x: 100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: -100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: 150,
            pos: { x: 0, y: 0 }
        }
    ];
    var targetData = rectData;
    var lastData;
    var nextRect = [
        {
            width: 400,
            height: 200,
            x: -100,
            pos: { x: 0, y: 0 }
        },
        {
            width: 500,
            height: 200,
            x: 0,
            pos: { x: 0, y: 0 }
        },
        {
            width: 600,
            height: 200,
            x: 50,
            pos: { x: 0, y: 0 }
        }
    ];
    var zoomRect = [
        {
            width: width / 2,
            height: (height - rectWrapHeight) / 2,
            x: -100,
            pos: { x: width / 2, y: 0 }
        },
        {
            width: width / 2,
            height: rectWrapHeight,
            x: 0,
            pos: { x: width / 2, y: (height - rectWrapHeight) / 2 }
        },
        {
            width: width / 2,
            height: (height - rectWrapHeight) / 2,
            x: 50,
            pos: { x: width / 2, y: (height + rectWrapHeight) / 2 }
        }
    ];

    var color = "rgba(255,238,119,1.0)";
    /**
     * @type {CanvasRenderingContext2D}
     */
    var ctx = canvas.getContext("2d");
    initPos(rectData);
    initPos(nextRect);
    for (var i = 0; i < rectData.length; i++)
    {
        rectTransform[i] = Object.create(rectData[i]);
        rectTransform[i].pos = Object.create(rectData[i].pos);
    }

    /*setTimeout(() =>
    {
        maskZoomIn();
        setInterval(back, 1000);
        duration = 1000;
    }, 1000);*/

    window.requestAnimationFrame(update);
    var lastDelay = 0;
    var transformStartTime = 0;
    var time = 0;
    var duration = 1000;
    function update(delay)
    {
        time = delay;
        var dt = (delay - lastDelay) / 1000;
        var t = (time - transformStartTime) / duration;
        if (t > 1)
        {
            rectData = targetData;
            t = 1;
        }
        ctx.fillStyle = color;
        ctx.clearRect(0, 0, width, height);
        ctx.fillRect(0, 0, width, height);
        var w = width / (lineCount + 1);
        for (var i = 1; i <= lineCount; i++)
        {
            var x = Math.floor(w * i)+0.5;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.lineWidth = 0.1;
            ctx.stroke();
        }
        for (var i = 0; i < rectTransform.length; i++)
        {
            rectTransform[i].pos.x = interpolate(rectData[i].pos.x, targetData[i].pos.x, t);
            rectTransform[i].pos.y = interpolate(rectData[i].pos.y, targetData[i].pos.y, t);
            rectTransform[i].width = interpolate(rectData[i].width, targetData[i].width, t);
            rectTransform[i].height = interpolate(rectData[i].height, targetData[i].height, t);

            ctx.clearRect(rectTransform[i].pos.x, rectTransform[i].pos.y, rectTransform[i].width, rectTransform[i].height);
        }
        window.requestAnimationFrame(update);
    }
    function transformTo(nextRect)
    {
        lastData = rectData;
        rectData = rectTransform;
        targetData = nextRect;
        transformStartTime = time;
    }
    function next()
    {
        transformTo(randomNext());
    }
    function back()
    {
        transformTo(lastData);
    }

    function maskZoomIn()
    {
        transformTo(zoomRect);
        /*lastData = rectData;
        rectData = rectTransform;
        targetData = zoomRect;
        transformStartTime = time;*/
    }
    function randomNext()
    {
        for (var i = 0; i < nextRect.length; i++)
        {
            nextRect[i].width = 300 * Math.random() + 400;
            nextRect[i].x = 300 * (Math.random() - 0.5) * 2;
        }
        initPos(nextRect);
        return nextRect;
    }
    function initPos(rectData)
    {
        var totalHeight = 0;
        for (var i = 0; i < rectData.length; i++)
        {
            rectData[i].pos.y = totalHeight;
            totalHeight += rectWrapHeight;
        }
        for (var i = 0; i < rectData.length; i++)
        {
            (function (rect)
            {
                var x = width / 2;
                x += rect.x;
                x -= rect.width / 2;
                var y = (height - totalHeight) / 2 + rect.pos.y;
                y += (rectWrapHeight - rect.height) / 2;
                rect.pos = { x: x, y: y };
            })(rectData[i]);
        }
    }
    function interpolate(from, to, t)
    {
        return timingFunc(t) * (to - from) + from;
    }
    function timingFunc(t, iterate)
    {
        if (iterate === undefined)
            iterate = 2;
        if (iterate === 0)
            return t;
        return (-Math.cos(Math.PI * timingFunc(t, iterate - 1)) + 1) / 2;
    }
    window.maskNext = next;
    window.maskBack = back;
    window.maskZoomIn = maskZoomIn;
}
function initCircle()
{
    var element = document.getElementById("circle");
    var width = window.innerWidth;
    var height = window.innerHeight;
    var k = 0.1;
    var scaled = false;
    window.addEventListener("mousemove", function (e)
    {
        if (scaled)
            return;    
        var x = e.clientX;
        var y = e.clientY;
        var offsetX = x - width / 2;
        var offsetY = y - height / 2;
        offsetX *= k;
        offsetY *= k;
        element.style.left = offsetX + "px";
        element.style.top = offsetY + "px";
    });
    function zoomIn()
    {
        scaled = true;
        element.style.left = 0;
        element.style.top = 0;
        element.style.width = element.style.height = Math.sqrt(width * width + height * height) + "px";
        //setTimeout(zoomOut, 1000);
    }
    function zoomOut()
    {
        scaled = false;
        element.style.left = 0;
        element.style.top = 0;
        element.style.width = element.style.height = "500px";
    }
    //setTimeout(zoomIn, 1000);
    window.circleZoomIn = zoomIn;
    window.circleZoomOut = zoomOut;
}
function initImage()
{
    var imgs = document.querySelectorAll(".bg-img");
    
}
window.zoomIn = function ()
{
    circleZoomIn();
    maskZoomIn();
}
window.zoomOut = function ()
{
    circleZoomOut();
    maskBack();
}
window.moveRight = function ()
{
    maskNext();
}
window.moveLeft = function ()
{
    maskNext();
}