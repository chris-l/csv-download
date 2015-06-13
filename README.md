# csv-download

A simple web component to download an array of arrays (or array-like objects) as a CSV file. It extends the `<a>` element.

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
    <a is="csv-download" data="{{someArray}}" download="someCsv.csv"></a>
    ```

## Options

Attribute     | Options     | Default      | Description
---           | ---         | ---          | ---
`data`        | *array*     | `[]`         | Array of arrays to be converted to csv.
`download`    | *string*    | `data.csv`   | Default filename.
`delimiter`   | *string*    | `,`          | Delimiter to separate the columns.


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT License](http://opensource.org/licenses/MIT)
