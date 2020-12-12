export type DataPoint = {
  date: string;
  value: number;
};

type TimelineMonth = {
  monthYear: Date;
  value: number;
  meta: any;
}[];
