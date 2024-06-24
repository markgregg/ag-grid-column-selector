import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridReadyEvent,
  IRowNode,
} from 'ag-grid-community';
import {
  FilterFunction,
  Matcher,
  ReactSmartSearchAgGrid,
} from 'react-smart-search';
import AgGridViewManager, {
  AgGridViewManagerApi,
  View,
} from 'ag-grid-view-manager';
import { TbColumns } from 'react-icons/tb';
import Bond from '@/TestApp/types/Bond';
import { bonds } from '@/TestApp/data/bonds';
import { columns } from './AppFunctions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { localStoragePersistence } from '@/persistence/localStorePersistence';
import './App.css';
import AgGridColumnSelector from '@/component/AgGridColumnSelector';

export default function App(): JSX.Element {
  const agGridViewManagerApiRef = React.useRef<AgGridViewManagerApi | null>(
    null,
  );
  const filterRef = React.useRef<FilterFunction | null>(null);
  const [matchers, setMatchers] = React.useState<Matcher[]>([]);
  const [rowData] = React.useState<Bond[]>(bonds);
  const [columnDefs] = React.useState<ColDef<Bond>[]>(columns);
  const [gridApi, setGridApi] = React.useState<GridApi<Bond> | null>(null);
  const [columnApi, setColumnApi] = React.useState<ColumnApi | null>(null);
  const [columnsVisible, setColumnsVisible] = React.useState<boolean>(false);

  const matchersChanged = (
    newMatchers: Matcher[],
    newFilter: FilterFunction | null,
  ) => {
    setMatchers(newMatchers);
    filterRef.current = newFilter;
    gridApi?.onFilterChanged();
    agGridViewManagerApiRef.current?.viewChanged(newMatchers);
  };

  const handleGridReady = React.useCallback((event: GridReadyEvent<Bond>) => {
    setGridApi(event.api);
    setColumnApi(event.columnApi);
  }, []);

  const handleGridChanged = () => {
    agGridViewManagerApiRef.current?.viewChanged(matchers);
  };

  const isExternalFilterPresent = React.useCallback(
    (): boolean => filterRef.current !== null,
    [],
  );

  const doesExternalFilterPass = React.useCallback(
    (node: IRowNode<Bond>): boolean =>
      filterRef.current !== null && filterRef.current(node),
    [],
  );

  const handleSelect = (view: View) => {
    setMatchers(view.customState ?? []);
  };

  return (
    <div className="mainContainer">
      <div className="mainToolBar">
        <AgGridViewManager
          ref={agGridViewManagerApiRef}
          columnApi={columnApi}
          persistence={localStoragePersistence('TEST_APP')}
          onSelect={(v) => handleSelect(v)}
          style={{ width: '200px' }}
        />
        <div className="mainSearchbar">
          <ReactSmartSearchAgGrid
            matchers={matchers}
            onChanged={(m, f) => matchersChanged(m, f)}
            maxMatcherWidth={250}
            gridApi={gridApi}
            columnApi={columnApi}
            keyboardActivityTimeout={1000}
          />
        </div>
        <div
          className="columnAddButton"
          onClick={() => setColumnsVisible(true)}
        >
          <TbColumns />
        </div>
      </div>
      <div className="mainContent">
        <AgGridColumnSelector
          columnApi={columnApi}
          visible={columnsVisible}
          onClose={() => setColumnsVisible(false)}
        />
        <div className="ag-theme-alpine agGrid">
          <AgGridReact
            onGridReady={handleGridReady}
            rowData={rowData}
            columnDefs={columnDefs}
            onColumnVisible={() => handleGridChanged()}
            onColumnPinned={() => handleGridChanged()}
            onColumnResized={() => handleGridChanged()}
            onColumnMoved={() => handleGridChanged()}
            onColumnRowGroupChanged={() => handleGridChanged()}
            onColumnValueChanged={() => handleGridChanged()}
            onColumnPivotChanged={() => handleGridChanged()}
            onSortChanged={() => handleGridChanged()}
            isExternalFilterPresent={isExternalFilterPresent}
            doesExternalFilterPass={doesExternalFilterPass}
          />
        </div>
      </div>
    </div>
  );
}
