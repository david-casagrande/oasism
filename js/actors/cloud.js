class Cloud {
  constructor(opts = {}) {
    this.x = opts.x || 0;
    this.y = opts.x || 0;
    this.step = opts.step || 0.5;
    this.resources = opts.resources;
    this.image = opts.image;
  }

  update() {
    const img = this.resources.get(this.image);

    this.x += this.step;
    if(this.x > img.width) {
      this.x = 0;
    }
    const secondX = -(img.width) + this.x;
    return [
      [
        img,
        this.x,
        this.y
      ],
      [
        img,
        secondX,
        this.y
      ]
    ];
  }

  render(ctx) {
    var updated = this.update();
    ctx.drawImage(...updated[1]);
    ctx.drawImage(...updated[0]);
  }
}

export default Cloud;
