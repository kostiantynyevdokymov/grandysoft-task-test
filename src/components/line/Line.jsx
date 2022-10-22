import Point from 'components/point/Point';
import Collision from 'components/collision/Collision';

class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.center = null;
    this.scalePercent = 0;
  }
  setEndPoint(point) {
    this.end = point;
  }

  calculateCenter() {
    const x = (this.start.x + this.end.x) / 2;
    const y = (this.start.y + this.end.y) / 2;
    this.center = new Point(x, y);
  }
  cross(line) {
    return Collision.getCollision(this, line);
  }
  draw(context) {
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.lineTo(this.end.x, this.end.y);
    context.stroke();
  }
  scalePoint(point, center, percent) {
    if (point.hasScale()) {
      const scaleX =
        Math.abs((point.x - center.x) * percent) *
        (point.x > center.x ? -1 : 1);
      const scaleY =
        Math.abs((point.y - center.y) * percent) *
        (point.y > center.y ? -1 : 1);
      point.setScale(scaleX, scaleY);
    }
    point.scale();
  }
  setScale(percent) {
    this.scalePercent = percent;
  }
  hasScale() {
    return this.scalePercent !== 0;
  }
  scale() {
    if (!this.center) this.calculateCenter();
    this.scalePoint(this.start, this.center, this.scalePercent);
    this.scalePoint(this.end, this.center, this.scalePercent);
    if (
      Math.abs(this.start.x - this.end.x) +
        Math.abs(this.start.y - this.end.y) <
      2
    ) {
      this.start.clear();
      this.end.clear();
    }
  }
  compare(line) {
    return this.start.compare(line.start) && this.end.compare(line.end);
  }
}
export default Line;
