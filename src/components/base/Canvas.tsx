import { action, autorun, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { bound } from 'src/utils';

export interface CanvasProps<T> extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  width: number;
  height: number;
  render: (canvas: HTMLCanvasElement) => void;
}

@observer
export class Canvas<T> extends React.Component<CanvasProps<T>> {
  private canvas: HTMLCanvasElement;
  private disposer: IReactionDisposer;

  public componentDidMount() {
    this.disposer = autorun(this.performRender);
  }

  public componentWillUnmount() {
    this.disposer();
  }

  public render() {
    const canvasProps = Object.assign({}, this.props, { render: undefined });
    return <canvas ref={this.setCanvas} {...canvasProps} />;
  }

  @action.bound
  private setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  @bound
  private performRender() {
    this.props.render(this.canvas);
  }
}