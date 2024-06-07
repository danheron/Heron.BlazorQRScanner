import jsQR from "jsqr";

export default class Scanner {

    private _module: DotNet.DotNetObject;
    private _stream: MediaStream;
    private _video: HTMLVideoElement;
    private _canvasElement: HTMLCanvasElement;
    private _canvas: CanvasRenderingContext2D;
    private _stopping: boolean;

    public start(canvas: HTMLCanvasElement, module: DotNet.DotNetObject): void {
        this._stopping = false;
        this._canvasElement = canvas;
        this._module = module;
        this._canvas = this._canvasElement.getContext("2d", {willReadFrequently: true});

        // Ensure that media devices exist
        if (navigator.mediaDevices == undefined) {
            throw new Error("MediaDevicesNotFound");
        }

        // Open camera
        const constraints: MediaStreamConstraints = {
            video: {
                facingMode: "environment"
            },
            audio: false
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream => this.createVideo(stream)))
            .catch((err) => {
                console.error(err);
                throw err;
            });
    }

    public stop(): void {
        this._stopping = true;
        if (this._video != null) {
            this._video.pause();
            this._video = null;
        }
        if (this._stream != null) {
            this._stream.getTracks().forEach(track => track.stop());
            this._stream = null;
        }
        if (this._canvas != null) {
            this._canvas.clearRect(0, 0, this._canvasElement.width, this._canvasElement.height);
            this._canvas = null;
        }
        this._canvasElement = null;
    }

    private createVideo(stream: MediaStream): void {
        this._stream = stream;
        const video = document.createElement("video");
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.play();
        this._video = video;
        requestAnimationFrame(() => this.tick());
    }

    private tick(): void {
        if (this._stopping) return;

        if (this._video.readyState === this._video.HAVE_ENOUGH_DATA) {
            // Set canvas to correct size
            this._canvasElement.width = this._video.videoWidth;
            this._canvasElement.height = this._video.videoHeight;

            // Draw image on canvas
            this._canvas.drawImage(this._video, 0, 0, this._canvasElement.width, this._canvasElement.height);

            // Look for QR code
            const imageData = this._canvas.getImageData(0, 0, this._canvasElement.width, this._canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
                this._module.invokeMethod<void>("ScanResult", code.data);
            }
        }
        requestAnimationFrame(() => this.tick());
    }
}

export function createScanner(): Scanner {
    return new Scanner();
}
