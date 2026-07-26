export interface Income {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  description: string;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  paymentMethod: string;
}