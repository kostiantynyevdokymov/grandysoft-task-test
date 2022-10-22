import React from 'react';
import Line from 'components/line/Line';
import Point from 'components/point/Point';
import CollisionPoint from 'components/collisionpoint/CollisionPoint';

const FPS = 1000 / 60;
const Scale = 1 / (60 * 3);
const Collapetime = 3000;

class CanvasComponent extends React.Component {
  constructor(props) {
    super(props);

    // inizilation handle change
    this.handleClick = this.handleClick.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.contextMenu = this.contextMenu.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);

    this.state = {
      lines: [],
      temp: {
        startPoint: new Point(),
        endPoint: new Point(),
      },
      drawing: false,
      collapse: false,
    };

    // get object canvas

    this.lineCanvas = null;
    this.setLineCanvasRef = canvas => {
      this.lineCanvas = canvas;
    };
    this.timerId = null;
  }
  handleClick(evt) {
    // While the lines are being deleted, drawing is not allowed.
    if (this.state.collapse) return;
    //drawing check
    if (!this.state.drawing) {
      //save start point line
      const point = Point.createPointFromEvent(evt);
      this.setState({
        temp: {
          startPoint: point,
          endPoint: point,
        },
        drawing: true,
      });
    } else {
      // save line end point on second mouse click
      const endPoint = Point.createPointFromEvent(evt);
      const line = new Line(this.state.temp.startPoint, endPoint);

      this.setState(state => {
        return {
          lines: [...state.lines, line],
          temp: {
            startPoint: new Point(),
            endPoint: new Point(),
          },
          drawing: false,
        };
      });
    }
  }
  contextMenu(evt) {
    // cancel drawing on right mouse click
    if (this.state.drawing) this.setState({ drawing: false });
  }
  mouseMove(evt) {
    // Updating the estimated line when moving the mouse cursor
    if (this.state.drawing) {
      this.setState(state => {
        return {
          temp: {
            startPoint: state.temp.startPoint,
            endPoint: Point.createPointFromEvent(evt),
            drawing: state.temp.drawing,
          },
        };
      });
    }
  }

  componentDidMount() {
    const context = this.lineCanvas.getContext('2d');
    this.timerId = setInterval(() => {
      // drawing lines
      context.clearRect(0, 0, this.props.width, this.props.height);
      if (this.state.lines) {
        this.state.lines.forEach(line => {
          //If the "Collapse lines" button was pressed, the lines are reduced for each frame until they are deleted
          if (this.state.collapse) {
            line.scale();
          }
          line.draw(context);
        });
      }
      //Drawing line intersections
      if (this.state.lines.length > 1) {
        const lines = this.state.lines;
        for (let i = 1; i < lines.length; i += 1) {
          for (let a = 0; a < i; a += 1) {
            let result = lines[i].cross(lines[a]);
            if (CollisionPoint.isCollisionPoint(result)) result.draw(context);
          }
        }
      }
      // Drawing the line the user wants to create, along with finding intersections for it
      if (this.state.drawing) {
        const tempLine = new Line(
          new Point(this.state.temp.startPoint.x, this.state.temp.startPoint.y),
          new Point(this.state.temp.endPoint.y)
        );
        tempLine.draw(context);
        this.state.lines.forEach(line => {
          const result = tempLine.cross(line);
          if (CollisionPoint.isCollisionPoint(result)) {
            result.draw(context);
          }
        });
      }
    }, FPS);
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
  }
  handleCollapse(evt) {
    // inizaliation delete lines
    if (this.state.lines.length > 0) {
      this.state.lines.forEach(l => l.setScale(Scale));
      this.setState({ collapse: true });
      setTimeout(() => {
        this.setState({
          lines: [],
          temp: {
            startPoint: new Point(),
            endPoint: new Point(),
          },
          drawing: false,
          collapse: false,
        });
      }, Collapetime);
    }
  }
  render() {
    return (
      <div className="wrap-canvas">
        <canvas
          className="canvas"
          ref={this.setLineCanvasRef}
          onClick={this.handleClick}
          onMouseMove={this.mouseMove}
          onContextMenu={this.contextMenu}
          width={this.props.width}
          height={this.props.height}
        />
        <button className="button" onClick={this.handleCollapse}>
          collapse lines
        </button>
      </div>
    );
  }
}

export default CanvasComponent;
