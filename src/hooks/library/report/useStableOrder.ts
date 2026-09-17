import { useState } from "react";

// 화면에 머무는 동안 첫 정렬 순서 유지, 다시 진입하면 새로 정렬
export const useStableOrder = <T>(items: T[] | undefined, getId: (item: T) => number) => {
  const [order, setOrder] = useState<number[] | null>(null);

  if (order === null && items && items.length > 0) {
    setOrder(items.map(getId));
  }

  if (!items || !order) return items;

  const indexById = new Map(order.map((id, index) => [id, index]));

  return [...items].sort(
    (a, b) =>
      (indexById.get(getId(a)) ?? Number.MAX_SAFE_INTEGER) -
      (indexById.get(getId(b)) ?? Number.MAX_SAFE_INTEGER),
  );
};
