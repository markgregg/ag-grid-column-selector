import * as React from 'react';
import { ColumnPinnedType, ColumnState } from 'ag-grid-community';
import SelectedColumn from '../SelectedColumn';
import './SelectedColumnList.css';

export interface SelectedColumnListProps {
  columns: ColumnState[]; // ag-grid column api
  onDeselected: (column: ColumnState) => void;
  onColumnOrderChanged: (columns: ColumnState[]) => void;
  onInsertColumn: (source: string, target: string) => void;
  onColumnUpdate: (column: ColumnState) => void;
}

export default function SelectedColumnList({
  columns,
  onDeselected,
  onColumnOrderChanged,
  onInsertColumn,
  onColumnUpdate,
}: SelectedColumnListProps) {
  const [tempColumns, setTempColumns] = React.useState<ColumnState[] | null>(
    null,
  );

  const handleColumnDeselect = (column: ColumnState) => {
    onDeselected(column);
  };

  const handleStartDrag = () => {
    setTempColumns(columns);
  };

  const handleEndDrag = () => {
    if (tempColumns) {
      onColumnOrderChanged(tempColumns);
    }
    setTempColumns(null);
  };

  const handleAdjustPosition = (source: string, target: string) => {
    if (tempColumns) {
      const sourceIdx = tempColumns.findIndex(
        (c) => c.colId.toLowerCase() === source.toLowerCase(),
      );
      const targetIdx = tempColumns.findIndex((c) => c.colId === target);
      if (sourceIdx !== -1 && targetIdx !== -1) {
        const soruceItem = tempColumns[sourceIdx];
        const targetItem = tempColumns[targetIdx];
        tempColumns.splice(targetIdx, 1, soruceItem);
        tempColumns.splice(sourceIdx, 1, targetItem);
        setTempColumns([...tempColumns]);
      }
    }
  };

  const handlePinUpdate = (column: ColumnState, pinned: ColumnPinnedType) => {
    onColumnUpdate({
      ...column,
      pinned,
    });
  };

  return (
    <div id="agGridColumnSelector" className="selectedColumnsList">
      <div className="selectedColumnsListTitle">Reorder Columns</div>
      <div className="selectedColumnsListColumns">
        {(tempColumns ?? columns).map((column) => (
          <SelectedColumn
            key={column.colId}
            column={column}
            onDeselect={() => handleColumnDeselect(column)}
            onStartDrag={handleStartDrag}
            onAdjustPosition={handleAdjustPosition}
            onEndDrag={handleEndDrag}
            onInsertColumn={onInsertColumn}
            onPinUpdate={(p) => handlePinUpdate(column, p)}
          />
        ))}
      </div>
    </div>
  );
}
