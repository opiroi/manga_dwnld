import WordPressMadara from './templates/WordPressMadara.mjs';

export default class FirstKiss extends WordPressMadara {

    constructor() {
        super();
        super.id = 'firstkiss';
        super.label = '1st Kiss Manga';
        this.tags = ['webtoon', 'english'];
        this.url = 'https://1stkissmanga.me';
        this.requestOptions.headers.set('x-referer', this.url);
        this.requestOptions.headers.set('x-origin', this.url);
    }
}
