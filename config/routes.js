/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

	/***************************************************************************
	*                                                                          *
	* Make the view located at `views/homepage.ejs` your home page.            *
	*                                                                          *
	* (Alternatively, remove this and add an `index.html` file in your         *
	* `assets` directory)                                                      *
	*                                                                          *
	***************************************************************************/

	'/': { view: 'pages/homepage' },
	'GET /getQCVCF/:id': 'TestController.getQCVCF',
	'GET /analysis/getFastqQC': 'FastqQCController.getFastqQC',
	'POST /test': 'TestController.test',
	'GET /analysis/:id': 'AnalysisController.getAnalysisName',
	'POST /variant/:id/select-variant-to-report': 'VariantController.selectVariantToReport',
	'GET /analysis-info/:id': 'AnalysisController.getAnalysisInfo',
	'POST /variant/:id': 'VariantController.variant',
	'GET /analysis/get-igv-info/:id': 'VariantController.getIgvInfo',
	'POST /analysis/list/:id': 'AnalysisController.list',
	'POST /workspaces/list': 'WorkspacesController.listWorkspaces',
	'POST /getGeneDetail': 'VariantController.getGeneDetail',
	'POST /getSeletedVariants/:id': 'VariantController.getSeletedVariants',
	'POST /getSeletedVariants/:id/createReport': 'VariantController.createReport',
	'POST /getSeletedVariants/:id/exportReport': 'VariantController.exportReport',
	'GET /analysis/get-igv-info/:id' : 'VariantController.getIgvInfo',
	'POST /analysis/list/:id' : 'AnalysisController.list',
	'DELETE /analysis/deleteAnalysis/:id' : 'AnalysisController.deleteAnalysis',
	'POST /workspaces/list' : 'WorkspacesController.listWorkspaces',
	'POST /getLineageDetail' : 'SarcovController.getLineageDetail',

	'GET /workspaces/get-workspace-name': 'WorkspacesController.getProjectName',

	//SamplesController
	'POST /samples/list': 'SamplesController.list',
	'POST /uploadSample': 'SamplesController.uploadSample',

	// WorkspacesController
	'GET /workspace/project-name/:id': 'WorkspacesController.getProjectName',

	'POST /analyses-list' : 'AnalysisController.getAnalysesList',

	'POST /analysis/venn-data': 'AnalysisController.getVenndatas',
	'GET /workspaces/dashboard/:id': 'WorkspacesController.getWorkspaceDashboard',
	'GET /workspaces/getPipeline': 'WorkspacesController.getListPipeline',
	'POST /workspaces/createWorkspace': 'WorkspacesController.createWorkspace',
	'POST /workspaces/update': 'WorkspacesController.updateWorkspaceDashboard',
	'POST /workspaces/search': 'WorkspacesController.search',
	'DELETE /workspaces/deleteWorkspace/:id': 'WorkspacesController.deleteWorkspace',

	// UsersController

	'POST /users/login': 'UsersController.login',

	'/users/getCurrentUser ': 'UsersController.getCurrentUser',

	'/users/logout ': 'UsersController.logout',

	'POST /users': 'UsersController.getUsers',
	'POST /users/createUser': 'UsersController.createUser',
	'GET /users/findUserById/:id': 'UsersController.findUserById',
	'POST /users/updateUser': 'UsersController.updateUser',
	'DELETE /users/deleteUser/:id': 'UsersController.deleteUser',
	'POST /users/setPasswordUser': 'UsersController.setPasswordUser',
	'POST /users/updatePassword': 'UsersController.updateForgotPassword',
	'POST /users/forgotPassword': 'UsersController.forgotPassword',
	'POST /users/updatePasswordProfile': 'UsersController.updatePassword',
	'GET /users/getUserById/:id': 'UsersController.getUserById',
	'POST /users/updateUserProfile': 'UsersController.updateUserProfile',
	
	// Vep Controller
	'GET /vep/get-pending-sample': 'VepController.getPendingSample',
	'/vep/update-sample-status/:status': 'VepController.updateSampleStatus',

	
	// UploadController
	
	'POST /createMultipartUpload': 'UploadController.createMultipartUpload',
	'POST /completeMultipartUpload': 'UploadController.completeMultipartUpload',
	'POST /signed_url': 'UploadController.getSignedAuth',
	'POST /uploadFileInfor': 'UploadController.uploadFileInfor',
	'POST /upload': 'UploadController.find',
	'DELETE /upload/deleteUploadFile/:id': 'UploadController.deleteUploadFile',
	'GET /upload/getListWorkspace': 'UploadController.getListWorkspace'



	/***************************************************************************
	*                                                                          *
	* More custom routes here...                                               *
	* (See https://sailsjs.com/config/routes for examples.)                    *
	*                                                                          *
	* If a request to a URL doesn't match any of the routes in this file, it   *
	* is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
	* not match any of those, it is matched against static assets.             *
	*                                                                          *
	***************************************************************************/


};
