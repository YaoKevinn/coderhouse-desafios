// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";
import ReactDOMServer from "https://dev.jspm.io/react-dom@16.13.1/server";
import { createApp } from 'https://deno.land/x/servest@v1.3.1/mod.ts';

const app = createApp();
const colors: [string] = ['blue'];

app.handle('/', async (req) => {
    await req.respond({
        status: 200,
        headers: new Headers({
            "content-type": "text/html; charset=UTF-8",
        }),
        body: ReactDOMServer.renderToString(
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <title>servest</title>
                </head>
                <body>
                    <h1>Helloo</h1>
                    <p>Utilizar el endpoint POST localhost:8090/color</p> 
                    <p>con body: color: "blue"</p>
                    <p>para agregar un color</p>
                    <ul>
                        {
                            colors.map((color) => <li style={{color: color}}>{color}</li>)
                        }
                    </ul>
                </body>
            </html>
        ),
    })
});
app.post("/color", async (req) => {
    const body = await req.json();
    colors.push(body.color);
    console.log(colors);
    await req.respond({ status: 204 })
  });
app.listen({ port: 8090 });
