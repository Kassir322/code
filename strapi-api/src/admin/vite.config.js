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
				'dbmz85-85-192-24-172.ru.tuna.am',
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
