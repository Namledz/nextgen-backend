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

	'*': ['auth'],


	UsersController: {
		'getCurrentUser': ['auth'],
		'getUsers': ['auth', 'adminAuth'],
		'deleteUser': ['auth', 'adminAuth'],
		'setPasswordUser': true,
		'deleteUser': ['auth', 'adminAuth'],
		'updateUser': ['auth', 'adminAuth'],
		'findUserById': ['auth', 'adminAuth'],
		'createUser': ['auth', 'adminAuth'],
		'login': true,
		'logout': ['auth']
	},

	VepController: {
		'*': true
	},

	FilterController: {
		'*': ['auth']
	},

	WorkspacesController: {
		'getWorkspaceDashboard': ['auth', 'sharedWorkspaces']
	},

	VariantController: {
		'variant': ['auth','sharedAnalysis']
	},

	AnalysisController : {
		'getAnalysisName': ['auth','sharedAnalysis'],
		'list': ['auth', 'sharedWorkspaces']
	}

};
