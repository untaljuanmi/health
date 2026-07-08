import { MyToastType } from '../types';

export interface MyToastInterface {
  id: number;
  message: string;
  type: MyToastType;
  visible: boolean;
}
