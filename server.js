const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const port = 3007;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
    //key: fs.readFileSync('certs/private-key.pem'),
    key: fs.readFileSync('/var/www/html/callCenter/ringingo_ssl/mysite.key'),
    cert: fs.readFileSync('/var/www/html/callCenter/ringingo_ssl/mysite.crt')
   // cert: fs.readFileSync('certs/certificate.pem')
};
app.prepare().then(() => {
    createServer(httpsOptions, async (req, res) => {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        // console.log('ready - started server on url: https://192.168.1.25:' + port);
        console.log('ready - started server on url: https://localhost:' + port);
    });
});
