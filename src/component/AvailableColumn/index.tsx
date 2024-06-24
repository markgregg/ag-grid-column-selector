import * as React from 'react';
import { RiDraggable } from 'react-icons/ri';
import './AvailableColumn.css';
import { ColumnState } from 'ag-grid-community';
import { DRAG_AVAILABLE_PREFIX } from '@/general/constants';

interface AvailableColumnProps {
  column: ColumnState;
  onSelected: (selected: boolean) => void;
}

export default function AvailableColumn({
  column,
  onSelected,
}: AvailableColumnProps): JSX.Element {
  const { colId, hide } = column;

  const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(event.target.checked);
    event.stopPropagation();
  };

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData(`${DRAG_AVAILABLE_PREFIX}/${colId}`, colId);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="csAvailableColumn"
      onDragStart={handleDragStart}
      draggable={hide === true}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <input
        className="csAvailableColumnCheckBox"
        type="checkbox"
        checked={!hide}
        onChange={handleSelection}
      />
      <div className="csAvailableColumnTitle">{colId}</div>
      {hide && (
        <div className="csAvailableColumnThumb">
          <RiDraggable />
        </div>
      )}
    </div>
  );
}
