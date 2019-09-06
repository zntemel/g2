/**
 * 画布范围的类型定
 */
export interface Region {
  readonly start: Point;
  readonly end: Point;
}

/**
 * 一个点位置
 */
export interface Point {
  readonly x: number;
  readonly y: number;
}

export type Padding = number | number[] | string;
