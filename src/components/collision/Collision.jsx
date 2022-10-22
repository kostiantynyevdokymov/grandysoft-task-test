import Point from 'components/point/Point';
import CollisionPoint from 'components/collisionpoint/CollisionPoint';

//The class is used to find the intersection between two lines
class Collision {
  static getCollision(line1, line2) {
    const EPS = 0.000001;
    if (line1.compare(line2)) return false;

    const x1 = line1.start.x;
    const y1 = line1.start.y;
    const x2 = line1.end.x;
    const y2 = line1.end.y;

    const x3 = line2.start.x;
    const y3 = line2.start.y;
    const x4 = line2.end.x;
    const y4 = line2.end.y;

    let x;
    let y;

    let denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    let numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
    let numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

    if (Math.abs(numA) < EPS && Math.abs(numB) < EPS && Math.abs(denom) < EPS) {
      x = (x1 + x2) / 2;
      y = (y1 + y2) / 2;
      return new CollisionPoint(new Point(x, y));
    }
    if (Math.abs(denom) < EPS) {
      return false;
    }

    const muA = numA / denom;
    const muB = numB / denom;

    if (muA < 0 || muA > 1 || muB < 0 || muB > 1) {
      return false;
    }
    x = x1 + muA * (x2 - x1);
    y = y1 + muA * (y2 - y1);
    return new CollisionPoint(new Point(x, y));
  }
}
export default Collision;
