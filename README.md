# angery-reacts

`angery reacts` is a quick web-app that I spun up that runs sentiment analysis on song lyrics: essentially, it'll scan song lyrics word by word, tagging how "positive" or "negative" they are, and then summing those weights to give a final answer. This approach is actually quite inaccurate: it doesn't look at phrases, adjectives, or other important NLP concepts that I don't really understand. However, it's a pretty fun tool to play around with!

This is actually split into a frontend and a backend, and you'll need both in order to run the web app. This repo contains the frontend (written with [React](https://reactjs.org), [Bulma](https://bulma.io), [sentiment](https://www.npmjs.com/package/sentiment), and [sanitize-html](https://www.npmjs.com/package/sanitize-html)), which sends requests to the [backend](https://github.com/mattxwang/angery-reacts-backend), a simple flask server that sends requests to the [Genius API](https://docs.genius.com/) to grab song lyrics and other metadata.

## development setup

Before we start any setup, I'll note that you'll need to set two environment variables: `GENIUS_API_KEY`, which is your client secret from the [Genius API](https://docs.genius.com/), and `REACT_APP_ANGERY_REACTS_SERVER_URL`, which is the URL to the backend server. First, head to the [Genius API](https://docs.genius.com/) and pick up your client secret; without it, the backend won't work.

As previously noted, you'll need both a copy of the frontend and the backend to run this app. First, let's set up the backend. In order to run the backend, you'll need access to a shell and Python 3 installed on your system.

```sh
$ git clone https://github.com/mattxwang/angery-reacts-backend.git
$ cd angery-reacts-backend
$ pip3 install -r requirements.txt
$ python3 server.py
* Serving Flask app "server" (lazy loading)
* Environment: production
  WARNING: This is a development server. Do not use it in a production deployment.
  Use a production WSGI server instead.
* Debug mode: on
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

Whatever address follows after *Running on* is the value of `REACT_APP_ANGERY_REACTS_SERVER_URL`: be sure to set that environment variable before you set up and run your frontend.

To run the frontend, you'll need access to a shell, and Node installed on your system (I developed this with v10). CRA also prefers [yarn](https://yarnpkg.com), though `npm` is also fine.

```sh
$ git clone https://github.com/mattxwang/angery-reacts.git
$ cd angery-reacts
$ yarn install # or npm install
$ yarn start # or npm start
Compiled successfully!

You can now view angery-reacts in the browser.

  Local:            http://localhost:3000/
  On Your Network:  ...

Note that the development build is not optimized.
To create a production build, use yarn build.
```

A window should pop up automatically with the frontend running! If you run into any issues, feel free to [drop me an issue](https://github.com/mattxwang/angery-reacts/issues) and I'll do my best to help you out.

## deploying to gh-pages

Instead of using Travis CI like I normally do, I opted to use the `gh-pages` npm package. Configure the `homepage` key in `package.json` so React will know what URL to route from, and change the environment variable prepended to `npm run deploy` and `npm run predeploy` - then just do `npm run deploy` or `yarn run deploy` - everything should work out of the box!
