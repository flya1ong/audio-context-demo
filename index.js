let audio = document.getElementById('myAudio')
audio.crossOrigin = 'anonymous';
let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const analyser = audioCtx.createAnalyser()
const audioSource = audioCtx.createMediaElementSource(audio)
audioSource.connect(analyser)
analyser.connect(audioCtx.destination)

const playBtn = document.getElementById('play')
const pauseBtn = document.getElementById('pause')

const canvas = document.getElementById('myCanvas')
const canvasCtx = canvas.getContext('2d')
const WIDTH = canvas.width
const HEIGHT = canvas.height

let drawVisual
// let type = 'sinewave'
let type = 'frequencybars'
function visualize() {

    if (type === 'sinewave') {

        analyser.fftSize = 2048
        const bufferLength = analyser.frequencyBinCount
        let dataArray = new Uint8Array(bufferLength)

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

        function draw() {
            drawVisual = requestAnimationFrame(draw)
            analyser.getByteTimeDomainData(dataArray)
            canvasCtx.fillStyle = "rgb(200, 200, 200)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(0, 0, 0)";

            canvasCtx.beginPath();

            const sliceWidth = (WIDTH * 1.0) / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                let y = (v * HEIGHT) / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        }

        draw()
    } else if (type === 'frequencybars') {
        analyser.fftSize = 256;
        const bufferLengthAlt = analyser.frequencyBinCount;
        console.log(bufferLengthAlt);

        // See comment above for Float32Array()
        const dataArrayAlt = new Uint8Array(bufferLengthAlt);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const drawAlt = function () {
            drawVisual = requestAnimationFrame(drawAlt);

            analyser.getByteFrequencyData(dataArrayAlt);

            canvasCtx.fillStyle = "rgb(0, 0, 0)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLengthAlt; i++) {
                barHeight = dataArrayAlt[i];

                canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
                canvasCtx.fillRect(
                    x,
                    HEIGHT - barHeight / 2,
                    barWidth,
                    barHeight / 2
                );

                x += barWidth + 1;
            }
        };

        drawAlt();
    }
}

playBtn.onclick = () => {
    audio.play()
    visualize()
}

pauseBtn.onclick = () => {
    audio.pause()
}