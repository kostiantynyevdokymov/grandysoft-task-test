class CollisionPoint {
  constructor(point) {
    this.point = point;
  }
  static isCollisionPoint(point) {
    return point instanceof CollisionPoint;
  }
  draw(context) {
    context.beginPath();
    context.fillStyle = '#FA3B1D';
    context.arc(this.point.x, this.point.y, 5, 0, 2 * Math.PI);
    context.fill();
  }
}
export default CollisionPoint;
