const axios = require('axios')
const pkg = require('../package.json');

const WADM_HOST = 'https://www.werkaandemuur.nl/api'
const WADM_PAGE_SIZE = 25

class WadmClient {
  constructor(
    userId,
    accessToken,
    config = {
      host: WADM_HOST,
      pageSize: WADM_PAGE_SIZE,
    }
  ) {
    this.userId = userId
    this.accessToken = accessToken
    this.config = config
  }

  axiosOptions = () => ({
    auth: {
      username: this.userId,
      password: this.accessToken,
    },
    headers: { 'User-Agent': `${pkg.name}-${pkg.version}`}
  })

  async connectionTest() {
    try {
      const result = await axios.get(`${this.config.host}/connectiontest`)
      return !!(result && result.data)
    } catch (e) {
      return false
    }
  }

  async authenticationTest() {
    try {
      const result = await axios.get(
        `${this.config.host}/authenticationtest`,
        this.axiosOptions()
      )
      return !!(result && result.data)
    } catch (e) {
      return false
    }
  }

  async getArtworkById(artworkId) {
    if (!artworkId) throw new Error('No artworkId provided!')
    try {
      const result = await axios.get(
        `${this.config.host}/artwork/${artworkId}`,
        this.axiosOptions()
      )
      if (
        result &&
        result.data &&
        result.data.data &&
        result.data.data.artwork
      ) {
        return result.data.data.artwork
      } else {
        return false
      }
    } catch (e) {
      throw e.message
    }
  }

  async getPagedArtworks(page = 1) {
    try {
      const result = await axios.get(
        `${this.config.host}/artlist/${this.userId}/${this.config.pageSize}/${page}`,
        this.axiosOptions()
      )
      if (result && result.data && result.data.data && result.data.data.artworks) {
        const { artworks, stats } = result.data.data
        return { artworks, stats }
      }
      return false
    } catch (e) {
      throw e.message
    }
  }

  async getArtworks() {
    let totalArtworks = []
    let ended = false
    let currentPage = 1
    while (!ended) {
      try {
        const data = await this.getPagedArtworks(currentPage)
        totalArtworks = totalArtworks.concat(data.artworks)
        if (data.stats.currentPage < data.stats.totalPages) {
          currentPage++
        } else {
          ended = true
        }
      } catch (e) {
        ended = true
        throw e.message
      }
    }
    return { artworks: totalArtworks }
  }
}

module.exports = WadmClient
