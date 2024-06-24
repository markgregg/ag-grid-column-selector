import * as React from 'react';
import { ColumnPinnedType, ColumnState } from 'ag-grid-community';
import { RiDraggable, RiCloseLine, RiUnpinLine } from 'react-icons/ri';
import { RxPinLeft, RxPinRight } from 'react-icons/rx';
import {
  DRAG_AVAILABLE_PREFIX,
  DRAG_SELECTED_PREFIX,
} from '@/general/constants';
import './SelectedColumn.css';

interface SelectedColumnProps {
  column: ColumnState;
  onDeselect: () => void;
  onStartDrag: () => void;
  onAdjustPosition: (source: string, target: string) => void;
  onEndDrag: () => void;
  onInsertColumn: (source: string, target: string) => void;
  onPinUpdate: (pin: ColumnPinnedType) => void;
}

export default function SelectedColumn({
  column,
  onDeselect,
  onStartDrag,
  onAdjustPosition,
  onEndDrag,
  onInsertColumn,
  onPinUpdate,
}: SelectedColumnProps): JSX.Element {
  const { colId, pinned } = column;
  const [mouseOver, setMouseOver] = React.useState<boolean>(false);

  const handleDeselect = (event: React.MouseEvent) => {
    if (event.button === 0) {
      event.stopPropagation();
      event.preventDefault();
      onDeselect();
    }
  };

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData(`${DRAG_SELECTED_PREFIX}/${colId}`, colId);
    event.dataTransfer.effectAllowed = 'move';
    onStartDrag();
  };

  const handleDragOver = (event: React.DragEvent) => {
    const dragType = event.dataTransfer.types.find(
      (type) =>
        type.includes(DRAG_SELECTED_PREFIX) ||
        type.includes(DRAG_AVAILABLE_PREFIX),
    );
    if (dragType) {
      const parts = dragType.split('/');
      if (parts.length > 1) {
        const [source, adjustTitle] = parts;
        if (source === DRAG_SELECTED_PREFIX) {
          if (adjustTitle.toLowerCase() !== colId.toLowerCase()) {
            event.dataTransfer.dropEffect = 'move';
            event.preventDefault();
            onAdjustPosition(adjustTitle, colId);
          }
        } else {
          event.dataTransfer.dropEffect = 'move';
          event.preventDefault();
        }
      }
    }
  };

  const handleDragEnd = () => {
    onEndDrag();
  };

  const handleDragDrop = (event: React.DragEvent) => {
    const dragType = event.dataTransfer.types.find((type) =>
      type.includes(DRAG_AVAILABLE_PREFIX),
    );
    if (dragType) {
      const field = event.dataTransfer.getData(dragType);
      onInsertColumn(field, colId);
      event.preventDefault();
    }
  };

  const handlePin = (event: React.MouseEvent, pin: ColumnPinnedType) => {
    if (event.button === 0) {
      event.stopPropagation();
      event.preventDefault();
      onPinUpdate(pin);
    }
  };

  return (
    <div
      className="csSelectedColumn"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDragDrop}
      draggable
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="csSelectedColumnIcon" onMouseDown={handleDeselect}>
        <RiCloseLine />
      </div>
      <span className="csSelectedColumnTitle">{colId}</span>
      {pinned && (
        <div className="csSelectedColumnIconGroup">
          {pinned === 'left' ? 'Left' : 'Right'}
          <div
            className="csSelectedColumnIcon"
            onMouseDown={(e) => handlePin(e, null)}
          >
            <RiUnpinLine />
          </div>
        </div>
      )}
      {!pinned && mouseOver && (
        <div className="csSelectedColumnIconGroup">
          <div
            className="csSelectedColumnIcon"
            onMouseDown={(e) => handlePin(e, 'left')}
          >
            <RxPinLeft />
          </div>
          <div
            className="csSelectedColumnIcon"
            onMouseDown={(e) => handlePin(e, 'right')}
          >
            <RxPinRight />
          </div>
        </div>
      )}
      <div className="csSelectedColumnThumb">
        <RiDraggable />
      </div>
    </div>
  );
}
