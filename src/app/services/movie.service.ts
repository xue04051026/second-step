import { Injectable, inject } from '@angular/core';
import { Observable, defer, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly messageService = inject(MessageService);
  private readonly fallbackPoster = '/assets/default-poster.jpg';

  private movies: Movie[] = [
    {
      id: 1,
      title: '肖申克的救赎',
      director: '弗兰克·德拉邦特',
      releaseDate: new Date('1994-09-23'),
      rating: 9.3,
      isWatched: true,
      genre: '剧情 / 犯罪',
      runtime: 142,
      country: '美国',
      language: '英语',
      tagline: '希望，是困境中最温柔的反击。',
      summary: '银行家安迪在监狱中与瑞德建立深厚友谊，在漫长岁月中守住希望，完成自我救赎。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg'
    },
    {
      id: 2,
      title: '霸王别姬',
      director: '陈凯歌',
      releaseDate: new Date('1993-01-01'),
      rating: 9.5,
      isWatched: true,
      genre: '剧情 / 爱情',
      runtime: 171,
      country: '中国大陆 / 中国香港',
      language: '汉语普通话',
      tagline: '一曲人生悲欢，半部时代浮沉。',
      summary: '两位京剧伶人的命运在时代浪潮中反复交织，戏里戏外皆是执念与离散。',
      posterUrl: 'https://image.tmdb.org/t/p/original/yWG2toY0QuGmkdCrffm20GTLZ8D.jpg'
    },
    {
      id: 3,
      title: '阿甘正传',
      director: '罗伯特·泽米吉斯',
      releaseDate: new Date('1994-07-06'),
      rating: 9.1,
      isWatched: true,
      genre: '剧情 / 爱情',
      runtime: 142,
      country: '美国',
      language: '英语',
      tagline: '人生就像一盒巧克力。',
      summary: '阿甘以近乎天真的坚定穿越美国数十年历史，在奔跑与守候中完成自己的人生传奇。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg'
    },
    {
      id: 4,
      title: '泰坦尼克号',
      director: '詹姆斯·卡梅隆',
      releaseDate: new Date('1997-12-19'),
      rating: 9.4,
      isWatched: false,
      genre: '剧情 / 爱情 / 灾难',
      runtime: 194,
      country: '美国',
      language: '英语',
      tagline: '永恒不在海上，而在人心里。',
      summary: '杰克与露丝在豪华邮轮上短暂相遇，在命运巨变前点亮彼此生命中最耀眼的一段时光。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/18/Titanic_%281997_film%29_poster.png/500px-Titanic_%281997_film%29_poster.png'
    },
    {
      id: 5,
      title: '千与千寻',
      director: '宫崎骏',
      releaseDate: new Date('2001-07-20'),
      rating: 9.2,
      isWatched: true,
      genre: '动画 / 奇幻 / 冒险',
      runtime: 125,
      country: '日本',
      language: '日语',
      tagline: '在神隐世界里，勇气会发光。',
      summary: '误入神灵世界的千寻为了拯救父母与自己，一步步学会勇气、责任与温柔。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png'
    },
    {
      id: 6,
      title: '盗梦空间',
      director: '克里斯托弗·诺兰',
      releaseDate: new Date('2010-07-16'),
      rating: 9.0,
      isWatched: false,
      genre: '科幻 / 动作 / 悬疑',
      runtime: 148,
      country: '美国 / 英国',
      language: '英语',
      tagline: '梦境越深，真相越近。',
      summary: '一支特工团队潜入层层梦境执行高风险任务，在现实与意识边界中逼近真相。',
      posterUrl: 'https://image.tmdb.org/t/p/original/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg'
    },
    {
      id: 7,
      title: '星际穿越',
      director: '克里斯托弗·诺兰',
      releaseDate: new Date('2014-11-07'),
      rating: 9.4,
      isWatched: true,
      genre: '科幻 / 冒险 / 剧情',
      runtime: 169,
      country: '美国 / 英国 / 加拿大',
      language: '英语',
      tagline: '爱，是穿越时空仍然成立的引力。',
      summary: '在地球生态濒临崩溃之际，一位前宇航员踏上跨星系旅程，为人类寻找新家园。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'
    },
    {
      id: 8,
      title: '爱乐之城',
      director: '达米恩·查泽雷',
      releaseDate: new Date('2016-12-09'),
      rating: 8.8,
      isWatched: false,
      genre: '剧情 / 爱情 / 歌舞',
      runtime: 128,
      country: '美国',
      language: '英语',
      tagline: '献给所有在霓虹里追梦的人。',
      summary: '钢琴手与演员在洛杉矶相遇，爱情与理想在繁华夜色中彼此照亮，也彼此考验。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png'
    },
    {
      id: 9,
      title: '教父',
      director: '弗朗西斯·福特·科波拉',
      releaseDate: new Date('1972-03-24'),
      rating: 9.3,
      isWatched: true,
      genre: '剧情 / 犯罪',
      runtime: 175,
      country: '美国',
      language: '英语 / 意大利语',
      tagline: '一部改变黑帮电影叙事方式的经典。',
      summary: '科里昂家族在权力、忠诚与亲情之间维系帝国，也见证迈克尔一步步走向命运中心。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg'
    },
    {
      id: 10,
      title: '黑暗骑士',
      director: '克里斯托弗·诺兰',
      releaseDate: new Date('2008-07-18'),
      rating: 9.2,
      isWatched: false,
      genre: '剧情 / 动作 / 犯罪',
      runtime: 152,
      country: '美国 / 英国',
      language: '英语',
      tagline: '当秩序失控，英雄也必须面对代价。',
      summary: '蝙蝠侠与戈登、哈维联手打击犯罪，却在小丑制造的混乱中被迫面对人性的极限。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/The_Dark_Knight_%282008_film%29.jpg/500px-The_Dark_Knight_%282008_film%29.jpg'
    },
    {
      id: 11,
      title: '黑客帝国',
      director: '莉莉·沃卓斯基 / 拉娜·沃卓斯基',
      releaseDate: new Date('1999-03-31'),
      rating: 9.0,
      isWatched: false,
      genre: '科幻 / 动作',
      runtime: 136,
      country: '美国 / 澳大利亚',
      language: '英语',
      tagline: '如果世界是程序，你敢醒来吗？',
      summary: '程序员尼奥被引入真实世界，逐渐意识到现实只是一个巨大系统构建出的幻象。',
      posterUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/db/The_Matrix.png/500px-The_Matrix.png'
    }
  ];

  private nextId = 12;

  getMovies(): Observable<Movie[]> {
    return of(this.movies.map(movie => this.withPoster(movie))).pipe(
      delay(200),
      tap(list => this.messageService.add(`MovieService: 已加载 ${list.length} 部电影`)),
      catchError(error => {
        this.messageService.add(`MovieService: 加载失败 - ${this.describeError(error)}`);
        return of([]);
      })
    );
  }

  getMovie(id: number): Observable<Movie | undefined> {
    return this.getMovieById(id);
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return of(this.movies.find(item => item.id === id)).pipe(
      delay(150),
      tap(movie => {
        this.messageService.add(
          movie ? `MovieService: 查询到电影 ${movie.title}` : `MovieService: id=${id} 未找到`
        );
      }),
      catchError(error => {
        this.messageService.add(`MovieService: 查询失败 - ${this.describeError(error)}`);
        return of(undefined);
      })
    );
  }

  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    return defer(() => {
      const newMovie: Movie = {
        ...movie,
        id: this.nextId++,
        posterUrl: movie.posterUrl || this.fallbackPoster
      };

      this.movies = [...this.movies, newMovie];
      return of(this.withPoster(newMovie));
    }).pipe(
      delay(150),
      tap(created => this.messageService.add(`MovieService: 已新增电影 ${created.title}`)),
      catchError(error => {
        this.messageService.add(`MovieService: 新增失败 - ${this.describeError(error)}`);
        return throwError(() => error);
      })
    );
  }

  updateMovie(updatedMovie: Movie): Observable<Movie> {
    return defer(() => {
      const movie = this.withPoster(updatedMovie);
      this.movies = this.movies.map(item => (item.id === movie.id ? movie : item));
      return of(movie);
    }).pipe(
      delay(150),
      tap(movie => this.messageService.add(`MovieService: 已更新电影 ${movie.title}`)),
      catchError(error => {
        this.messageService.add(`MovieService: 更新失败 - ${this.describeError(error)}`);
        return throwError(() => error);
      })
    );
  }

  deleteMovie(id: number): Observable<boolean> {
    let deletedTitle = '';

    return defer(() => {
      const target = this.movies.find(movie => movie.id === id);
      deletedTitle = target?.title || '';
      this.movies = this.movies.filter(movie => movie.id !== id);
      return of(!!target);
    }).pipe(
      delay(150),
      tap(deleted => {
        this.messageService.add(
          deleted ? `MovieService: 已删除电影 ${deletedTitle}` : `MovieService: id=${id} 删除失败`
        );
      }),
      catchError(error => {
        this.messageService.add(`MovieService: 删除失败 - ${this.describeError(error)}`);
        return throwError(() => error);
      })
    );
  }

  private withPoster(movie: Movie): Movie {
    return {
      ...movie,
      posterUrl: movie.posterUrl || this.fallbackPoster
    };
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
