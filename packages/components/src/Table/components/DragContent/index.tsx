import type { CheckboxList } from "../TableFilter";
import { type DragEndEvent, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DragOutlined } from "@ant-design/icons";
import { Checkbox } from "antd";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import styles from "./index.module.less";

interface SortableItemProps {
  item: CheckboxList;
  index: number;
}

interface DragContentProps {
  list: CheckboxList[];
  handleDragEnd: (list: CheckboxList[]) => void;
}

// 排序组件
function SortableItem(props: SortableItemProps) {
  const { item } = props;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.value, // 每个可拖拽对象的唯一标识
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className={styles.drag_item} style={style} {...attributes}>
      <div className={`${styles.drag_item_handle} drag-handle`} {...listeners}>
        <DragOutlined />
      </div>
      <Checkbox value={item.value} style={{ flex: 1 }}>
        {item.label}
      </Checkbox>
    </div>
  );
}

// 拖拽组件
function DragContent(props: DragContentProps) {
  const { list, handleDragEnd } = props;

  /** 拖拽结束操作 */
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // 计算拖拽后的新顺序
    const oldIndex = list.findIndex((item) => item.value === active.id);
    const newIndex = list.findIndex((item) => item.value === over.id);
    const newColumns = arrayMove(list, oldIndex, newIndex);
    handleDragEnd(newColumns);
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext
        items={list.map((item) => item.value)}
        strategy={verticalListSortingStrategy}
      >
        {list?.map((item, index) => (
          <SortableItem key={item.value} index={index} item={item} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default DragContent;
