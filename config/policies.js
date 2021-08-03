/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

	/***************************************************************************
	*                                                                          *
	* Default policy for all controllers and actions, unless overridden.       *
	* (`true` allows public access)                                            *
	*                                                                          *
	***************************************************************************/

	// '*': true,


	UsersController: {
		'getCurrentUser': ['auth'],
		'getUsers': ['auth'],
		'deleteUser': ['auth'],
		'setPasswordUser': true,
		'deleteUser': ['auth'],
		'updateUser': ['auth'],
		'findUserById': ['auth'],
		'createUser': ['auth'],
		'login': true,
		'logout': ['auth']
	}

};
