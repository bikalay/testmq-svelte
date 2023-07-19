export class BaseRenderer {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor (width: number, height: number) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
    }

    render () {

    }

    draw () {
        this.render();
        return this.canvas;
    }

    clear () {
        this.context.clearRect(0, 0, this.width, this.height);
    }
}
