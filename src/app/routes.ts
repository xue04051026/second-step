// 临时修复：无法解析 @angular/router，先注释掉，待安装依赖后恢复
import { Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MovieListComponent
  }
];