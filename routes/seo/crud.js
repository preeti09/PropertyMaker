
const express = require('express');
const router = express.Router();
var routerModel = require(`./model-${require('../../config').get('DATA_BACKEND')}`);
const urlMetadata = require('url-metadata');
var fetchUrl = require("fetch").fetchUrl;

router.get('/', (req, res, next) => {
    
    res.send('I am in API router');
})

router.post('/login', (req, res, next) => {
    routerModel.loginUser(req.body, (err, entity) => {
        res.send(entity);
    })
})

router.post('/saveData', (req, res, next) => {
    var data = [{
        custom_tags: req.body.customMetaTags,
        page_url: req.body.baseUrl,
        meta_title: req.body.metaTitle,
        meta_description: req.body.metaDescription,
        keywords: req.body.focusKeywords.toString(),
        status : 1
    }];

    routerModel.checkUrl_Exists(data[0].page_url, (err, entity) => {
        if (entity && entity.status == 'success' && entity.msg.ID) {
            var id = entity.msg.ID;
            routerModel.updateData(data, id, (err1, entity1) => {
                res.send(JSON.stringify(entity1));
                return;
            })
        } else {
            routerModel.saveData(data, (err1, entity1) => {
                res.send(JSON.stringify(entity1));
                return;
            });
        }
    });
});

router.post('/getDataByID', (req, res, next) => {
    routerModel.getDataByID(req.body.id, (err, data) => {
        res.send(JSON.stringify(data));
        return;
    });
});

router.get('/grid', (req, res, next) => {
    routerModel.getGridData((err, entity) => {
        res.send(entity);
    })
});

router.post('/changeStatus', (req, res, next) => {
    var status = (req.body.status == 1) ? 0 : 1;
    routerModel.changeStatus(req.body.ID,status,(err, entity) => {
        res.send(entity);
    })
});

router.post('/deleteRow', (req, res, next) => {
    routerModel.deleteRow(req.body.ID,(err, entity) => {
        res.send(entity);
    })
});

router.post('/metaData', (req, res, next) => {
    urlMetadata(req.body.url).then(
        function (metadata) {
            res.send(JSON.stringify(metadata));
        },
        function (error) {
            res.send(JSON.stringify(error));
        })
});

router.post('/htmlData', (req, res, next) => {
    fetchUrl(req.body.url, function (error, meta, body) {
        if (error) {
            res.send(JSON.stringify(error));
            return;
        }
        res.send(body.toString());
    });
});

router.post('/createSiteMap', (req, res, next) => {
    res.connection.setTimeout(0);
    const SitemapGenerator = require('sitemap-generator');
    var date = new Date();
    var file = 'sitemap'+date.getTime()+'.xml';
    var filename = 'public/sitemap/'+file;
    const generator = SitemapGenerator(req.body.url, {
        maxDepth: 0,
        filepath: filename,
        maxEntriesPerFile: 50000,
        stripQuerystring: true
    });
    res.setHeader('Content-Type', 'text/html');
    generator.on('add', (url) => {
        console.log(url,' =================== added url');
        // res.write(url);
        // res.json({ name: 'Richard' });
    });
    generator.on('error', (error) => {
        console.log(error,' ============= error');
    });
    generator.on('ignore', (url) => {
        console.log(url,' =================== ignore url');
    });
    generator.on('done', () => {
        res.send({msg:'Sitemap Done',filename:file,host:req.headers.host});
        // res.end();
    });
    generator.start();
});

router.get('/downloadSiteMap/:filename', (req, res, next) => {
    console.log(req.params);
    downloadSiteMap(res,req.params.filename)
});
function downloadSiteMap(res,filename){
    filename = 'public/sitemap/'+filename;
    res.download(filename);
}

module.exports = router;