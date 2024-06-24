import * as React from 'react';
import { ColumnApi, ColumnState } from 'ag-grid-community';
import { RiCloseLine } from 'react-icons/ri';
import { TiTick } from 'react-icons/ti';
import AvailableColumnList from '../AvailableColumnList';
import SelectedColumnList from '../SelectedColumnList';
import './AgGridColumnSelector.css';
import DraggableContainer from '../DraggableContainer';

export interface AgGridColumnSelectorProps {
  columnApi: ColumnApi | null; // ag-grid column api
  visible: boolean;
  onClose: () => void;
}

export default function AgGridColumnSelector({
  columnApi,
  visible,
  onClose,
}: AgGridColumnSelectorProps) {
  const [availableColumns, setAvailableColumns] = React.useState<ColumnState[]>(
    [],
  );
  const [selectedColumns, setSelectedColumns] = React.useState<ColumnState[]>(
    [],
  );

  React.useEffect(() => {
    fetchColumns();
  }, [columnApi]);

  const fetchColumns = () => {
    if (columnApi !== null) {
      const columnState = columnApi.getColumnState();
      if (columnState) {
        setAvailableColumns(columnState);
        setSelectedColumns(columnState.filter((agColumn) => !agColumn.hide));
      }
    }
  };

  const handleReset = (event: React.MouseEvent) => {
    if (event.button === 0) {
      event.stopPropagation();
      event.preventDefault();
      fetchColumns();
    }
  };

  const handleSelectionToggle = (column: ColumnState, selected: boolean) => {
    setAvailableColumns(
      availableColumns.map((col) =>
        col.colId !== column.colId ? col : { ...column, hide: !selected },
      ),
    );
    if (selected) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      setSelectedColumns(
        selectedColumns.filter((col) => col.colId !== column.colId),
      );
    }
  };

  const handleDeslectColumn = (column: ColumnState) => {
    setAvailableColumns(
      availableColumns.map((col) =>
        col.colId !== column.colId ? col : { ...column, hide: true },
      ),
    );
    setSelectedColumns(
      selectedColumns.filter((col) => col.colId !== column.colId),
    );
  };

  const handleColumnOrderChange = (columns: ColumnState[]) => {
    setSelectedColumns(columns);
  };

  const handleInsertColumn = (source: string, target: string) => {
    const column = availableColumns.find((col) => col.colId === source);
    if (column) {
      const index = selectedColumns.findIndex((col) => col.colId === target);
      if (index !== -1) {
        selectedColumns.splice(index, 0, column);
        setAvailableColumns(
          availableColumns.map((col) =>
            col.colId !== source ? col : { ...col, hide: false },
          ),
        );
        setSelectedColumns([...selectedColumns]);
      }
    }
  };

  const handleColumnUpdate = (column: ColumnState) => {
    setAvailableColumns(
      availableColumns.map((col) =>
        col.colId === column.colId ? column : col,
      ),
    );
    setSelectedColumns(
      selectedColumns.map((col) => (col.colId === column.colId ? column : col)),
    );
  };

  const handleClose = (event: React.MouseEvent) => {
    if (event.button === 0) {
      event.stopPropagation();
      event.preventDefault();
      onClose();
    }
  };

  const handleApply = (event: React.MouseEvent) => {
    if (event.button === 0) {
      event.stopPropagation();
      event.preventDefault();
      const state = [...selectedColumns, ...availableColumns];
      columnApi?.applyColumnState({
        state,
        applyOrder: true,
      });
      onClose();
    }
  };

  return (
    <div className="agGridColumnSelectorAnchor">
      {visible && (
        <DraggableContainer minHeight={406} minWidth={444}>
          <div id="agGridColumnSelector" className="agGridColumnSelectorMain">
            <div className="agGridColumnSelectorHeader">
              <div className="agGridColumnSelectorTitle">Customise Columns</div>
              <div
                className="agGridColumnSelectorClose"
                onMouseDown={handleClose}
              >
                <RiCloseLine />
              </div>
            </div>
            <div className="agGridColumnSelectorContent">
              <AvailableColumnList
                columns={availableColumns}
                onSelectionToggle={handleSelectionToggle}
              />
              <SelectedColumnList
                columns={selectedColumns}
                onDeselected={handleDeslectColumn}
                onColumnOrderChanged={handleColumnOrderChange}
                onInsertColumn={handleInsertColumn}
                onColumnUpdate={handleColumnUpdate}
              />
            </div>
            <div className="agGridColumnSelectorFooter">
              <div className="agGridColumnSelectorResetDiv">
                <button
                  type="button"
                  onMouseDown={handleReset}
                  className="agGridColumnSelectorButton"
                >
                  Reset
                </button>
              </div>
              <button
                type="button"
                onMouseDown={handleApply}
                className="agGridColumnSelectorApply"
              >
                <TiTick />
                Apply
              </button>
              <button
                type="button"
                onMouseDown={handleClose}
                className="agGridColumnSelectorButton"
              >
                Cancel
              </button>
            </div>
          </div>
        </DraggableContainer>
      )}
    </div>
  );
}
