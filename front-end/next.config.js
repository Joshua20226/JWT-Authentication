module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.0.158:5000/api/:path*'
      }
    ]
  }
}