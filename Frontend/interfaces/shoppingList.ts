export interface IShoppingListPrevious{
    id: number;
    title: string;
    last_update: Date;
}
export interface IShoppingList {
    diet_id?: number  | null;
    title: string;
    options: { name: string; quantity: string }[];
  }

export interface Options {
    name: string;
    quantity: string;
  }

