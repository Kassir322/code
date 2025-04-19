const { mergeConfig } = require('vite')

module.exports = (config) => {
	return mergeConfig(config, {
		resolve: {
			alias: {
				'@': '/src',
			},
		},
		server: {
			allowedHosts: [
				'localhost',
				'127.0.0.1',
				'*.ngrok-free.app',
				'*.ngrok.io',
				'*.ngrok.app',
				'2a72-85-192-24-172.ngrok-free.app',
			],
			host: '0.0.0.0',
			port: 1337,
			strictPort: true,
			hmr: {
				protocol: 'ws',
				host: 'localhost',
				port: 1337,
			},
		},
	})
}
