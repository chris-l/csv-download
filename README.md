# &lt;csv-download&gt;

A simple web component to download an array of arrays (or array-like objects) as a CSV file.

## Demo

[Check it live!](http://chris-l.github.io/csv-download)

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install csv-download --save
```

Or [download as ZIP](https://github.com/chris-l/csv-download/archive/master.zip).

## Usage

1. Import Web Components' polyfill:

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
    ```

2. Import the csv-download element:

    ```html
    <link rel="import" href="bower_components/csv-download/dist/csv-download.html">
    ```

3. Start using it!

    ```html
    <csv-download data="{{someArray}}" filename="someCsv.csv"></csv-download>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`data`        | *array*     | `[]`         | Array of arrays to be converted to csv.
`filename`    | *string*    | `data.csv`   | Default filename.
`delimiter`   | *string*    | `,`          | Delimiter to separate the columns.

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

* Install [Bower](http://bower.io/) & [Grunt](http://gruntjs.com/):

    ```sh
    $ [sudo] npm install -g bower grunt-cli
    ```

* Install local dependencies:

    ```sh
    $ bower install && npm install
    ```

* To test your project, start the development server and open `http://localhost:8000`.

    ```sh
    $ grunt server
    ```

* To build the distribution files before releasing a new version.

    ```sh
    $ grunt build
    ```

* To provide a live demo, send everything to `gh-pages` branch.

    ```sh
    $ grunt deploy
    ```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT License](http://opensource.org/licenses/MIT)
