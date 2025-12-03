module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.0.157:5000/api/:path*'
      }
    ]
  }
}