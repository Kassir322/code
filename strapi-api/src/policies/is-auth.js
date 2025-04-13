'use strict'

/**
 * `is-auth` policy
 */

module.exports = (policyContext, config, { strapi }) => {
	if (policyContext.state.user) {
		// if a session is open
		return true
	}

	return false // If you return false, Strapi will block the request and send a 401 error
}
