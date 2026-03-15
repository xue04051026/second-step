import { Movie } from './models/movie';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: '盗梦空间',
    releaseDate: new Date(2010, 6, 16), // 2010-07-16
    director: '克里斯托弗·诺兰',
    rating: 9.3,
    isWatched: true,
    posterUrl: 'assets/images/1.jpg'
  },
  {
    id: 2,
    title: '肖申克的救赎',
    releaseDate: new Date(1994, 9, 14), // 1994-10-14
    director: '弗兰克·德拉邦特',
    rating: 9.7,
    isWatched: true,
    posterUrl: 'assets/images/2.jpg'
  },
  {
    id: 3,
    title: '复仇者联盟4：终局之战',
    releaseDate: new Date(2019, 3, 24), // 2019-04-24
    director: '安东尼·罗素、乔·罗素',
    rating: 8.5,
    isWatched: true,
    posterUrl: 'assets/images/3.jpg'
  },
  {
    id: 4,
    title: '千与千寻',
    releaseDate: new Date(2001, 6, 20), // 2001-07-20
    director: '宫崎骏',
    rating: 9.4,
    isWatched: true,
    posterUrl: 'assets/images/4.jpg'
  },
  {
    id: 5,
    title: '星际穿越',
    releaseDate: new Date(2014, 10, 7), // 2014-11-07
    director: '克里斯托弗·诺兰',
    rating: 9.3,
    isWatched: false,
    posterUrl: 'assets/images/5.jpg'
  },
  {
    id: 6,
    title: '泰坦尼克号',
    releaseDate: new Date(1997, 11, 19), // 1997-12-19
    director: '詹姆斯·卡梅隆',
    rating: 9.2,
    isWatched: true,
    posterUrl: 'assets/images/6.jpg'
  }
];