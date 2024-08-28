import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios'
import { keyFileStorage } from 'key-file-storage'
import cors from 'cors'

const store = keyFileStorage('./store')

const app = express();



app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next()
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const redirect = (url, method, res, req) => {
    let requestData = req?.body;
    const headers = {};

    // Reconstruct headers while keeping case sensitivity
    const rawHeaders = req?.rawHeaders ?? [];
    for (let i = 0; i < rawHeaders.length; i += 2) {
        headers[rawHeaders[i]] = rawHeaders[i + 1];
    }

    // Determine the content type and format the data accordingly
    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        // Convert the body to URL-encoded format
        const params = new URLSearchParams();
        Object.keys(req.body).forEach(key => {
            params.append(key, req.body[key]);
        });
        requestData = params.toString();
    }

    // Set Content-Type explicitly if it's not automatically detected
    if (!headers['Content-Type'] && typeof req?.body === 'object') {
        headers['Content-Type'] = 'application/json';
    }

    axios(url, {
        method,
        headers: { ...headers, host: new URL(url).host },
        data: requestData,
        responseType: 'stream',
    })
        .then(response => {
            // Forward response headers
            Object.keys(response.headers).forEach(key => {
                res.setHeader(key, response.headers[key]);
            });

            res.status(response.status);
            response.data.pipe(res);
        })
        .catch(error => {
            console.error('Error:', error.message);
            res.status(error.response?.status ?? 500);
            error.response?.data.pipe(res);
        });
};

app.all('/', (req, res) => {
    const url = req.headers['target-url']
    console.log(`$:URL => ${url}`);
    redirect(url, req.method.toLowerCase(), res, req)
})

app.get('/shorten', (req, res) => {
    const url = req.url?.replace("shorten/?", "")
    // random 4 alphanumeric key
    const keyName = Math.random().toString(36).substring(2, 6)
    store(keyName, url)
    const r = req.protocol + '://' + req.get('host') + '/'
    res.send({ shortenUrl: `${r}${keyName}` })
});

app.get('/:key', async (req, res) => {
    const key = req.params.key
    const url = await store[key]
    res.status(301).redirect
    // redirect(url, res)
})

app.listen(1234, () => {
    console.log('Server is running on port 1234');
})