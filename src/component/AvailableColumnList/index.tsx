import * as React from 'react';
import { ColumnState } from 'ag-grid-community';
import SearchBox from '../SearchBox';
import AvailableColumn from '../AvailableColumn';
import './AvailableColumnList.css';

export interface AvailableColumnListProps {
  columns: ColumnState[]; // ag-grid column api
  onSelectionToggle: (column: ColumnState, selected: boolean) => void;
}

export default function AvailableColumnList({
  columns,
  onSelectionToggle,
}: AvailableColumnListProps) {
  const [filterText, setFilterText] = React.useState<string>('');

  const handleTextChange = (text: string) => {
    setFilterText(text.toLowerCase());
  };

  const handleColumnSelection = (column: ColumnState, selected: boolean) => {
    onSelectionToggle(column, selected);
  };

  return (
    <div id="agGridColumnSelector" className="availableColumnsList">
      <div className="availableColumnsListTitle">Add/Remove Columns</div>
      <SearchBox onTextChanged={handleTextChange} />
      <div className="availableColumnsListColumns">
        {columns
          .filter((column) => column.colId.toLowerCase().includes(filterText))
          .map((column) => (
            <AvailableColumn
              key={column.colId}
              column={column}
              onSelected={(selected) => handleColumnSelection(column, selected)}
            />
          ))}
      </div>
    </div>
  );
}
