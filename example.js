/*
In order to execute this file, make sure you have a `.env` file
with the following properties:

WADM_USER_ID=XXXXX
WADM_ACCESS_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Run `npm i` to install the dependencies

Run `node example` from the root folder to execute this script.

It should return a console log of all items of the registered user.
*/

require('dotenv').config()

const WadmClient = require('./src/')

const { WADM_USER_ID, WADM_ACCESS_TOKEN } = process.env

const client = new WadmClient(WADM_USER_ID, WADM_ACCESS_TOKEN)

const __init = async () => {
    const isConnected = await client.connectionTest()
    const isAuthenticated = await client.authenticationTest()

    if (isConnected && isAuthenticated) {
        const allArtworks = await client.getArtworks()
        console.log(allArtworks)
    }
}

__init();