// stopWatch
class Stopwatch {
    constructor(element) {
        this.$element = $(element);
        this.$display = this.$element.find(".display");
        this.$startBtn = this.$element.find(".start-btn");
        this.$pauseBtn = this.$element.find(".pause-btn");
        this.$resetBtn = this.$element.find(".reset-btn");
        this.timer = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;

        // 버튼 이벤트 설정
        this.$startBtn.on("click", () => this.start());
        this.$pauseBtn.on("click", () => this.pause());
        this.$resetBtn.on("click", () => this.reset());
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.timer = setInterval(() => this.updateDisplay(), 10);
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timer);
            this.elapsedTime = Date.now() - this.startTime;
            this.isRunning = false;
        }
    }

    reset() {
        clearInterval(this.timer);
        this.elapsedTime = 0;
        this.isRunning = false;
        this.updateDisplay(true);
    }

    updateDisplay(reset = false) {
        const time = reset ? 0 : Date.now() - this.startTime;
        const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, "0");
        const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, "0");
        const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, "0"); // 1/100초 표시

        this.$display.text(`${minutes}:${seconds}:${milliseconds}`);
    }
}

// jQuery로 DOM 로드 후 스톱워치 초기화
$(".stop-watch").each(function() {
    new Stopwatch(this);
});

// header toggle 체크 여부에 따라 'dark-mode' 클래스 추가 및 그래프 색상 변경
$("#toggle1, #toggle2").on("change", function() {
    const isChecked = $(this).is(":checked"); // 클릭한 토글의 상태 확인
    $("body").toggleClass("dark-mode", isChecked);
    updateChartColors(isChecked);
});
