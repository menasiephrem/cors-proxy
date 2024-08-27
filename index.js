import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios'
import { keyFileStorage } from 'key-file-storage'
import cors from 'cors'

const store = keyFileStorage('./store')

const app = express();

app.use(cors())

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next()
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const redirect = (url, res, req) => {
    axios.get(url, {
        responseType: "stream",
        headers: { ...req.headers, host: new URL(url).host }
    })
        .then(response => {
            // if its a file send the file back
            for (let key in response.headers) {
                res.header(key, response.headers[key])
            }
            res.writeHead(response.status, response.headers);
            response.data.pipe(res)
        })
        .catch(error => {
            res
                .status(500)
                .send({ error: error.message });
        }
        )
}

app.get('/', (req, res) => {
    const url = Object.keys(req.query)[0]
    console.log(`$:URL => ${url}`);
    redirect(url, res, req)
})

app.get('/shorten', (req, res) => {
    const url = Object.keys(req.query)[0]
    // random 4 alphanumeric key
    const keyName = Math.random().toString(36).substring(2, 6)
    store(keyName, url)
    const r = req.protocol + '://' + req.get('host') + '/'
    res.send({ shortenUrl: `${r}${keyName}` })
});

app.get('/:key', async (req, res) => {
    const key = req.params.key
    const url = await store[key]
    redirect(url, res)
})

app.listen(1234, () => {
    console.log('Server is running on port 1234');
})