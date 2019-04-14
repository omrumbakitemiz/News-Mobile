import { NewsType } from './news-types.enum';

export class News {
  constructor(
    public id?: string,
    public title?: string,
    public text?: string,
    public type?: NewsType,
    public hidden?: boolean,
    public image?: string,
    public publishDate?: string,
    public likeCount?: number,
    public dislikeCount?: number,
    public viewCount?: number
  ) {}
}
