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
				'q6r0we-109-168-167-68.ru.tuna.am',
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
