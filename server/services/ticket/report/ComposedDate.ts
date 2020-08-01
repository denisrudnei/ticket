export default class ComposedDate {
  constructor(day: number, month: number, year: number) {
    this.day = day;
    this.month = month;
    this.year = year;
  }

  public day!: number;

  public month!: number;

  public year!: number;
}
