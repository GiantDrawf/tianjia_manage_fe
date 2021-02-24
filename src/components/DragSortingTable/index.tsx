import React, { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import type { Article } from '@/types/apiTypes';

const type = 'DragableBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }: any) => {
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

interface DragSortingTableProps {
  tableColumns: any[];
  dataSource: Article[];
  setDataSource: Dispatch<SetStateAction<Article[]>>;
  tableProps: TableProps<Article>;
}

export default function DragSortingTable(props: DragSortingTableProps) {
  const { tableColumns, dataSource, setDataSource, tableProps = {} } = props;

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = dataSource[dragIndex];
      setDataSource(
        update(dataSource, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [dataSource, setDataSource],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        {...tableProps}
        columns={tableColumns}
        dataSource={dataSource}
        components={components}
        onRow={(_, index) =>
          ({
            index,
            moveRow,
          } as any)
        }
      />
    </DndProvider>
  );
}
