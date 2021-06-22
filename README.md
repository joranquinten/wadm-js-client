# OhMyPrints / WadM JavaScript Client

This package exposes the API of [Werkaandemuur](https://www.werkaandemuur.nl/nl) via a JavaScript wrapper. It is pretty basic but should help you get started in combining data for your own use. It might also wordt for data that's exposed on [OhMyPrints](https://www.ohmyprints.com/de) (sibling company), but I haven't had a usecase nor tested it.

## Fair use

The REST API is exposed based by WadM on a fair usage policy. I've added a specific User Agent marker on the headers of every request it makes. With unfair usage, the package may get throttled or blocked. Please consider caching the result one way or another (it's not that you'd need live connection since uploading is a manual task). The API only exposes your own data, so don't bother trying to access some other profiles' data.

## Requirements

Make sure you have a personal API key. You can register one via your dashboard via the [WordPress plugin page](https://www.werkaandemuur.nl/nl/Wordpress-plugin/474), since we piggyback on the methods the WordPress plugin exposes. Store the `Artist ID` and `API Key` somewhere safe (secrets).

## Usage

Start a new instance of the client with the following:

```js
const WadmClient = require('./wadm-client')

const client = new WadmClient(USER_ID, API_KEY)
```

For a mock implementation, take peek at [example.js](./example.js)

## Methods

All methods return a promise (prefer `async/await` notation):

### connectionTest

Checks whether the API is reachable. Returns `true` or `false`:

```js
async () => {
    const isConnected = await client.connectionTest()
}
```
### authenticationTest

Checks whether the protected part of the API is reachable (all other endpoints). Use this the verify that the `User Id` and `API Key` are valid. Returns `true` or `false`:

```js
async () => {
    const isAuthenticated = await client.authenticationTest()
}
```

### getArtworkById(id)

Returns the JSON object of a particular artwork based on the provided Id. Returns an object `artwork: {}`:

```js
async () => {
    const artwork = await client.getArtworkById(SOME_ID)
}
```

### getPagedArtworks(page)

Returns an object containing artworks and stats. The artworks contain an array of JSON objects of a particular page of artworks based on the provided page number. If page number is not provided, it wil default to return page 1. The stats give you the paging properties which can be used to get a different page. The maximum number of items per page is 33. The client is set to **25**. Returns an object `{ artworks: [{}], stats }`:

```js
async () => {
    const artworks = await client.getPagedArtworks(SOME_PAGE_NUMBER)
}
```

### getArtworks()

Uses the paged result and maps the pages to a single array.
Returns the array of all artworks based for the user. Returns an Array `[ { artwork } ]`:

```js
async () => {
    const artworks = await client.getArtworks()
}
```

## Disclaimer

I am not affiliated with WadM or OhMyPrints. If the API changes, this wrapper will inevitably fail and will need some manual updating. Feel free to contribute to this repo if you like.