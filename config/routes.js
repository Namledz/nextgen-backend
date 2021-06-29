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
	'GET /analysis/get-igv-info/:id' : 'VariantController.getIgvInfo',
	'POST /analysis/list/:id' : 'AnalysisController.list',
	'POST /workspaces/list' : 'WorkspacesController.listWorkspaces',
	'POST /getLineageDetail' : 'SarcovController.getLineageDetail',

	//SamplesController
	'POST /samples/list': 'SamplesController.list',

	// WorkspacesController
	'GET /workspace/project-name/:id': 'WorkspacesController.getProjectName',

	'POST /analysis/venn-data': 'AnalysisController.getVenndatas'



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
