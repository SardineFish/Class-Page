window.addEventListener("load", load);
function load()
{
    var canvas = document.getElementById("canvas-mask");
    var width = parseInt(getComputedStyle(canvas).width);
    var height = parseInt(getComputedStyle(canvas).height);

    canvas.height = height;
    canvas.width = width;
    var rectWrapHeight = 220;
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
            width: width/2,
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
            pos: { x: width / 2, y: (height+rectWrapHeight) / 2 }
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

    setTimeout(() => {
        targetData = zoomRect;
        transformStartTime = time;
        duration = 1000;
    }, 1000);

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
            t = 1;    
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
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
        return (-Math.cos(Math.PI * timingFunc(t, iterate-1)) + 1) / 2;
    }

    
}