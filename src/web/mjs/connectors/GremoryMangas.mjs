import WordPressMangastream from './templates/WordPressMangastream.mjs';

export default class GremoryMangas extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gremorymangas';
        super.label = 'GremoryMangas';
        this.tags = ['spanish', 'scanlation', 'webtoon'];
        this.url = 'https://gremorymangas.com';
        this.path = '/manga/list-mode/';
        this.novelContainer = 'div.entry-content';
        this.novelContent = 'div#readerarea.rdminimal';
        //this.novelObstaclesQuery = 'img[src*="Logo-Tsundoku"]';
        this.novelFormat = 'image/png';
        this.novelWidth = '56em';// parseInt(1200 / window.devicePixelRatio) + 'px';
        this.novelPadding = '1.5em';
    }
    async _getPages(chapter) {
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await this.fetchDOM(request, 'div#readerarea.rdminimal');
        //reader for novel have this class. When its a manga there is no class at all so we call super.
        if (data.length == 0) {
            return await super._getPages(chapter);
        }
        let darkmode = Engine.Settings.NovelColorProfile();
        let script =`
        new Promise((resolve, reject) => {
            document.body.style.width = '${this.novelWidth}';
            document.body.style.backgroundColor = '${darkmode.background}';
            let container = document.querySelector('${this.novelContainer}');
            container.style.maxWidth = '${this.novelWidth}';
            container.style.padding = '0';
            container.style.margin = '0';
            container.style.backgroundColor = '${darkmode.background}';

            let novel = document.querySelector('${this.novelContent}');
            novel.style.padding = '${this.novelPadding}';
            [...novel.querySelectorAll(":not(:empty)")].forEach(ele => {
                ele.style.backgroundColor = '${darkmode.background}'
                ele.style.color = '${darkmode.text}'
            });

            novel.style.backgroundColor = '${darkmode.background}'
            novel.style.color = '${darkmode.text}';
            document.querySelectorAll('${this.novelObstaclesQuery}').forEach(element => element.style.display = 'none');
            //collect displayed pictures
            let pictures = [];
            [...novel.querySelectorAll('img.alignnone')].forEach(ele => {
                pictures.push(ele.src);
            });
            let script = document.createElement('script');
            script.onerror = error => reject(error);
            script.onload = async function() {
                try {
                    let canvas = await html2canvas(novel);
                    pictures.push(canvas.toDataURL('${this.novelFormat}'));
                    resolve(pictures);
                }
                catch (error){
                    reject(error)
                }
            }
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            document.body.appendChild(script);
        });
        `;
        return await Engine.Request.fetchUI(request, script, 30000, true);
    }
}