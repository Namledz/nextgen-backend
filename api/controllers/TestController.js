/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const cheerio = require('cheerio');

module.exports = {
  
	getQCVCF: (req, res) => {
		let id = req.params.id;
        let QCVCFTemplatePath = `pages/templates/QCVCF/${id}`;

		return new Promise(function (resolve, reject) {
			sails.renderView(QCVCFTemplatePath, { layout: false }, function (err, view) {
				if (err) {
					return reject(err)
				}
				return resolve(view)
			})
		})
        .then(function(html) {
            let $ = cheerio.load(html);
            // let style = `<style>` + $('style').html() + `</style>`;
            let style = `<style>
            center {
                margin-top: 20px;
                margin-bottom: 20px;
            }
            
            center b:not(table b) {
                font-size: 25px;
                color: darkgoldenrod;
            }
    
            center table { 
                border-spacing: 1; 
                border-collapse: collapse; 
                background:white;
                border-radius:6px;
                overflow:hidden;
                max-width:800px; 
                width:50%;
                margin:0 auto;
                position:relative;
                border: 0 !important;
              }
              
              center table td,th { padding-left:8px }
              
              center table thead tr { 
                  height: 45px;
                  background:#FFED86;
                  font-size:16px;
              }
              
              center table tbody tr { 
                  height:35px; border-bottom:1px solid #E3F1D5;
              }

              center table tfoot tr { 
                height:35px; border-bottom:1px solid #E3F1D5;
            }
              
              center table tbody tr &:last-child  { border:0; }
              
              center table td,th { 
                  text-align:left;  
              }
              
              center table td,th &.l { text-align:right }
              center table td,th &.c { text-align:center }
              center table td,th &.r { text-align:center }</style>`
            let variantsByType = $('a[name="changesByType"]').html();
            let effectsByFunctionalClass = $('a[name="effectsFuncClass"]').html();
            let variations = `<center>` + $('a[name="effects"] p:nth-child(3)').html() + `</center><hr>`;
            let effectsByRegion = `<center><table border=0>` + $('a[name="effects"] table').find('table:eq(1)').html() + `</table></center><hr>`;
            let tstv = $('a[name="tstv"]').html();
            let data = style + variantsByType + effectsByFunctionalClass + variations + effectsByRegion + tstv
            return res.json({ status: "success", html: data}) 
        })
        .catch(function(err) {
            console.log(err);
            return res.json({ status: "error"}) 
        })
	},

};

