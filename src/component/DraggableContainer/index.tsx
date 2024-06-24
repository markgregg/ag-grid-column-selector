import * as React from 'react';
import './DraggableContainer.css';

interface Position {
  x: number;
  y: number;
  h: number;
  w: number;
}

const defaultPosition = {
  x: 0,
  y: 0,
  h: 0,
  w: 0,
};

interface DraggableContainerProps {
  children?: React.ReactNode;
  minHeight?: number;
  minWidth?: number;
}

type MouseAction =
  | 'Move'
  | 'N-Size'
  | 'S-Size'
  | 'E-Size'
  | 'W-Size'
  | 'NE-Size'
  | 'NW-Size'
  | 'SW-Size'
  | 'SE-Size'
  | null;

const getCusor = (mouseAction: MouseAction) => {
  switch (mouseAction) {
    case 'N-Size':
      return 'n-resize';
    case 'S-Size':
      return 's-resize';
    case 'E-Size':
      return 'e-resize';
    case 'W-Size':
      return 'w-resize';
    case 'NE-Size':
      return 'ne-resize';
    case 'NW-Size':
      return 'nw-resize';
    case 'SW-Size':
      return 'sw-resize';
    case 'SE-Size':
      return 'se-resize';
    default:
      return 'n-resize';
  }
};

export default function DraggableContainer({
  children,
  minHeight,
  minWidth,
}: DraggableContainerProps) {
  const containerDivRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState<Position>(defaultPosition);
  const [mouseAction, setMouseAction] = React.useState<MouseAction>(null);
  const [preprosedMouseAction, setPreproseMouseAction] =
    React.useState<MouseAction>(null);

  React.useEffect(() => {
    if (containerDivRef.current) {
      setPosition({
        x: containerDivRef.current.offsetLeft,
        y: containerDivRef.current.offsetTop,
        h: containerDivRef.current.offsetHeight,
        w: containerDivRef.current.offsetWidth,
      });
    }
  }, []);

  React.useEffect(() => {
    const mouseDown = (event: MouseEvent) => {
      if (event.buttons === 1 && mouseAction === null) {
        if (preprosedMouseAction !== null) {
          setMouseAction(preprosedMouseAction);
        } else if (
          containerDivRef.current &&
          event.target &&
          containerDivRef.current.contains(event.target as Node)
        ) {
          setMouseAction('Move');
        }
      }
    };
    const mouseUp = () => {
      setMouseAction(null);
    };
    const mouseMove = (event: MouseEvent) => {
      if (mouseAction === 'Move') {
        setPosition((p) => ({
          x: p.x + event.movementX,
          y: p.y + event.movementY,
          h: p.h,
          w: p.w,
        }));
      } else if (mouseAction !== null) {
        switch (mouseAction) {
          case 'N-Size':
            setPosition((p) => ({
              x: p.x,
              y:
                !minHeight || p.h + event.movementY > minHeight
                  ? p.y + event.movementY
                  : p.y,
              h:
                !minHeight || p.h - event.movementY > minHeight
                  ? p.h - event.movementY
                  : p.h,
              w: p.w,
            }));
            break;
          case 'S-Size':
            setPosition((p) => ({
              x: p.x,
              y: p.y,
              h:
                !minHeight || p.h + event.movementY > minHeight
                  ? p.h + event.movementY
                  : p.h,
              w: p.w,
            }));
            break;
          case 'W-Size':
            setPosition((p) => ({
              x:
                !minWidth || p.w + event.movementX > minWidth
                  ? p.x + event.movementX
                  : p.x,
              y: p.y,
              h: p.h,
              w:
                !minWidth || p.w - event.movementX > minWidth
                  ? p.w - event.movementX
                  : p.w,
            }));
            break;
          case 'E-Size':
            setPosition((p) => ({
              x: p.x,
              y: p.y,
              h: p.h,
              w:
                !minWidth || p.w + event.movementX > minWidth
                  ? p.w + event.movementX
                  : p.w,
            }));
            break;
          case 'NE-Size':
            setPosition((p) => ({
              x: p.x,
              y:
                !minHeight || p.h + event.movementY > minHeight
                  ? p.y + event.movementY
                  : p.y,
              h:
                !minHeight || p.h - event.movementY > minHeight
                  ? p.h - event.movementY
                  : p.h,
              w:
                !minWidth || p.w + event.movementX > minWidth
                  ? p.w + event.movementX
                  : p.w,
            }));
            break;
          case 'NW-Size':
            setPosition((p) => ({
              x:
                !minWidth || p.w + event.movementX > minWidth
                  ? p.x + event.movementX
                  : p.x,
              y:
                !minHeight || p.h + event.movementY > minHeight
                  ? p.y + event.movementY
                  : p.y,
              h:
                !minHeight || p.h - event.movementY > minHeight
                  ? p.h - event.movementY
                  : p.h,
              w:
                !minWidth || p.w - event.movementX > minWidth
                  ? p.w - event.movementX
                  : p.w,
            }));
            break;
          case 'SE-Size':
            setPosition((p) => ({
              x: p.x,
              y: p.y,
              h:
                !minHeight || p.h + event.movementY > minHeight
                  ? p.h + event.movementY
                  : p.h,
              w:
                !minWidth || p.w + event.movementX > minWidth
                  ? p.w + event.movementX
                  : p.w,
            }));
            break;
          case 'SW-Size':
            setPosition((p) => ({
              x:
                !minWidth || p.w + event.movementX > minWidth
                  ? p.x + event.movementX
                  : p.x,
              y: p.y,
              h:
                !minHeight || p.h + event.movementY > minHeight
                  ? p.h + event.movementY
                  : p.h,
              w:
                !minWidth || p.w - event.movementX > minWidth
                  ? p.w - event.movementX
                  : p.w,
            }));
            break;
          default:
            // do nothing
            break;
        }
      } else if (
        containerDivRef.current &&
        event.target &&
        containerDivRef.current.contains(event.target as Node) &&
        event.buttons === 0
      ) {
        const clientX = event.clientX - containerDivRef.current.offsetLeft;
        const clientY = event.clientY - containerDivRef.current.offsetTop;
        const topPos = clientY < 6;
        const leftPos = clientX < 6;
        const bottomPos = containerDivRef.current.offsetHeight - clientY < 6;
        const rightPos = containerDivRef.current.offsetWidth - clientX < 6;
        setPreproseMouseAction(
          topPos && leftPos
            ? 'NW-Size'
            : topPos && rightPos
              ? 'NE-Size'
              : bottomPos && leftPos
                ? 'SW-Size'
                : bottomPos && rightPos
                  ? 'SE-Size'
                  : topPos
                    ? 'N-Size'
                    : bottomPos
                      ? 'S-Size'
                      : leftPos
                        ? 'W-Size'
                        : rightPos
                          ? 'E-Size'
                          : null,
        );
      } else if (preprosedMouseAction !== null) {
        setPreproseMouseAction(null);
      }
    };
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mousedown', mouseDown);
    document.addEventListener('mouseup', mouseUp);
    return () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, [mouseAction, preprosedMouseAction]);

  return (
    <div
      ref={containerDivRef}
      className="draggableMain"
      style={
        position !== defaultPosition
          ? {
              position: 'fixed',
              top: position.y,
              left: position.x,
              height: position.h,
              width: position.w,
              cursor: getCusor(preprosedMouseAction),
            }
          : {}
      }
    >
      <div className="draggableContentArea">{children}</div>
    </div>
  );
}
