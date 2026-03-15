export interface Movie {
  id: number;
  title: string; // 电影名
  releaseDate: Date; // 上映日期
  director: string; // 导演
  rating: number; // 评分 0-10
  isWatched: boolean; // 是否已观影
  posterUrl: string; // 海报 URL
}
