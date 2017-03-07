var ball = {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    data: [],//横杠的数据
    isLeft: true,//向左还是向右
    lineCount: 6,//总共能看见多少个横杠
    startX: 0,
    moveX: 0,
    ballLeft: 0,
    ballUp: -1,
    speed: 1,
    score: 0,
    ballR: $(".ball").height() / 2,
    init: function () {
        var me = this;
        this.initData(me.lineCount);
        me.render();
        me.move();
        me.initBtn();
    },
    initData: function (count) {
        var me = this;
        for (var i = 0; i < count; i++) {
            var obj = {};
            obj.width = me.width / (Math.random() * 2 + 2);

            obj.top = count === 1 ? me.height - 10 : me.height / me.lineCount * (i + 1) - 10;

            me.isLeft ? obj.left = 0 : obj.right = 0;
            me.isLeft = !me.isLeft;
            me.data.push(obj);
        }
    },
    render: function () {
        var me = this;
        for (var i = 0; i < me.data.length; i++) {
            var div;
            if (me.data[i].left === 0) {
                div = "<div style='width: " + me.data[i].width + "px;top: " + me.data[i].top + "px;left: " + me.data[i].left + "px'></div>";
            }
            else {
                div = "<div style='width: " + me.data[i].width + "px;top: " + me.data[i].top + "px;right: " + me.data[i].right + "px'></div>";
            }
            $("#background").append(div);
        }
    },
    move: function () {
        var me = ball;
        //横杠
        for (var i = 0; i < me.lineCount; i++) {
            me.data[i].top = me.data[i].top - me.speed;
            if (me.data[i].top < 0) {
                me.data.splice(i, 1);
                me.score++;
                me.ballUp -= 1;
                me.initData(1);
            }
        }
        $("#background").html("");
        me.render();
        //小球
        var top = $(".ball").offset().top;
        if (me.ballUp > -1) {
            $(".ball").css("top", me.data[me.ballUp].top - me.ballR * 2);
            if (top + me.ballR < 0) {
                console.log("输了");
                clearTimeout();
                return;
            }
        }
        else {
            if (top + me.ballR > me.height) {
                console.log("输了");
                clearTimeout();
                return;
            }
            $(".ball").css("top", top + me.speed);
            me.isUp();
        }
        if (me.score >= me.speed * me.speed * 5) {
            me.speed++;
        }
        setTimeout(me.move, 10);
    },
    isUp: function () {
        var me = this;
        var offset = $(".ball").offset();
        for (var i = 0; i < me.data.length; i++) {
            if (Math.abs(offset.top + me.ballR * 2 - me.data[i].top) <= me.speed * 2 && offset.left + me.ballR < me.data[i].width && me.data[i].left === 0) {
                me.ballUp = i;
                return;
            }
            else if (Math.abs(offset.top + me.ballR * 2 - me.data[i].top) <= me.speed * 2 && offset.left + me.ballR > me.width - me.data[i].width && me.data[i].right === 0) {
                me.ballUp = i;
                return;
            }
        }

    },
    initBtn: function () {
        var me = this;
        document.addEventListener('touchstart', function (event) {
            var touch = event.touches[0]; //获取第一个触点
            me.ballLeft = $(".ball").offset().left;
            me.startX = Number(touch.pageX); //页面触点X坐标
        }, false);
        document.addEventListener('touchmove', function (event) {
//            event.preventDefault();
            var offset = $(".ball").offset();
            if (me.ballUp > -1)
                if ((offset.left > me.data[me.ballUp].width && me.data[me.ballUp].left === 0 ) || (offset.left < me.width - me.data[me.ballUp].width && me.data[me.ballUp].right === 0))
                    me.ballUp = -1;
            var touch = event.touches[0]; //获取第一个触点
            me.moveX = Number(touch.pageX); //页面触点X坐标
            me.ballMove();
        }, false);

    },
    ballMove: function () {
        var me = this;
        var x = me.moveX - me.startX;
        var left = $(".ball").offset().left;
        if (left < 0 && x < 0) {
            $(".ball").css("left", 0);
            return;
        }
        if (left > me.width - me.ballR*2 && x > 0) {
            $(".ball").css("left", me.width - me.ballR*2);
            return;
        }
        $(".ball").css("left", me.ballLeft + x);
    }

};
$("document").ready(function () {
    ball.init();
});