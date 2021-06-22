const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const WadmClient = require('./index')
const MOCKDATA = require('./mock-data')

describe('Wadm client', () => {
    const WADM_HOST = 'https://www.werkaandemuur.nl/api'
    const WADM_PAGE_SIZE = 25
    const USER_ID = 'USER_ID'
    const ACCESS_TOKEN = 'ACCESS_TOKEN'


    const mock = new MockAdapter(axios);
    let client;
    beforeEach(() => {
        client = new WadmClient(USER_ID, ACCESS_TOKEN)
    })
    afterEach(() => {
        mock.reset();
    })

    describe('connectionTest', () => {
        test('should return `true` when it passes', async () => {
            mock.onGet(`${WADM_HOST}/connectiontest`).reply(200, {  })
            const result = await client.connectionTest()
            expect(result).toBeTruthy()
        })
        test('should return `false` when it fails', async () => {
            mock.onGet(`${WADM_HOST}/connectiontest`).reply(500, { })
            const result = await client.connectionTest()
            expect(result).toBeFalsy()
        })
    })

    describe('authenticationTest', () => {
        test('should return `true` when it passes', async () => {
            mock.onGet(`${WADM_HOST}/authenticationtest`).reply(200, { })
            const result = await client.authenticationTest()
            expect(result).toBeTruthy()
        })
        test('should return `false` when it fails', async () => {
            mock.onGet(`${WADM_HOST}/authenticationtest`).reply(403, { })
            const result = await client.authenticationTest()
            expect(result).toBeFalsy()
        })
    })

    describe('getArtworkById', () => {
        test('should return an artwork when an ID is provided', async () => {
            const ART_WORK_ID = 111111;
            mock.onGet(`${WADM_HOST}/artwork/${ART_WORK_ID}`).reply(200, { data: { artwork: MOCKDATA.artwork } })
            const result = await client.getArtworkById(ART_WORK_ID)
            expect(result).toEqual(MOCKDATA.artwork)
        })

        test('should return false when the data is not as expected', async () => {
            mock.onGet(`${WADM_HOST}/artwork/1`).reply(200, { data: { some: MOCKDATA.artwork } })
            mock.onGet(`${WADM_HOST}/artwork/2`).reply(200, { })
            mock.onGet(`${WADM_HOST}/artwork/3`).reply(200, undefined)
            const resultOtherProperty = await client.getArtworkById(1)
            expect(resultOtherProperty).toBeFalsy()
            const resultNoData = await client.getArtworkById(2)
            expect(resultNoData).toBeFalsy()
            const resultNothing = await client.getArtworkById(3)
            expect(resultNothing).toBeFalsy()
        })
    })

    describe('getPagedArtworks', () => {
        test('should default to page 1 if none provided', async () => {
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/1`).reply(200, { data: { artworks: MOCKDATA.artworks, stats: 'STATS' } })
            const result = await client.getPagedArtworks()
            expect(result.artworks).toBeTruthy()
            expect(result.stats).toBeTruthy()
        })

        test('should call to the correct page if provided', async () => {
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/5`).reply(200, { data: { artworks: MOCKDATA.artworks, stats: 'STATS' } })
            const result = await client.getPagedArtworks(5)
            expect(result.artworks).toBeTruthy()
            expect(result.stats).toBeTruthy()
        })

        test('should return false when the data is not as expected', async () => {
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/1`).reply(200, { data: { some: MOCKDATA.artwork } })
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/2`).reply(200, { })
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/3`).reply(200, undefined)
            const resultOtherProperty = await client.getPagedArtworks(1)
            expect(resultOtherProperty).toBeFalsy()
            const resultNoData = await client.getPagedArtworks(2)
            expect(resultNoData).toBeFalsy()
            const resultNothing = await client.getPagedArtworks(3)
            expect(resultNothing).toBeFalsy()
        })
    })

    describe('getArtworks', () => {

        test('should call the getPagedArtworks at least once', async () => {
            const spyClient = new WadmClient(USER_ID, ACCESS_TOKEN)
                
            jest.spyOn(spyClient, 'getPagedArtworks')
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/1`).reply(200, { data: { artworks: MOCKDATA.artworks, stats: { totalPages: 1 } } })
        
            await spyClient.getArtworks()
            expect(spyClient.getPagedArtworks).toHaveBeenCalledTimes(1)
        })

        test('should call the getPagedArtworks for every page that exists', async () => {
            const spyClient = new WadmClient(USER_ID, ACCESS_TOKEN)
                
            jest.spyOn(spyClient, 'getPagedArtworks')
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/1`).reply(200, { data: { artworks: MOCKDATA.artworks, stats: { currentPage: 1, totalPages: 2 } } })
            mock.onGet(`${WADM_HOST}/artlist/${USER_ID}/${WADM_PAGE_SIZE}/2`).reply(200, { data: { artworks: MOCKDATA.artworks, stats: { currentPage: 2, totalPages: 2 } } })
        
            await spyClient.getArtworks()
            expect(spyClient.getPagedArtworks).toHaveBeenCalledTimes(2)
        })
    })
})
 