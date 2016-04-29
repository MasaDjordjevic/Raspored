export interface INestedList {
    nestedListData: Array<NestedList>;
}

export class NestedList {
    outer: { id: number, s: string };
    inner: Array<{ id: number, s: string }>;
}
