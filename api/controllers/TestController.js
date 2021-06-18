/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const cheerio = require('cheerio');
const mongo = sails.config.MONGO;
var mongodb= require('mongodb');

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
            @media (max-width: 768px) {
                .fix-display {
                    display: inherit !important;
                }
                .fix-width {
                    width: 100% !important;
                }
                center table {
                    width: 100% !important;
                }
            }

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
                width:60%;
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
              center table td,th &.r { text-align:center }</style>`;

            $('a[name="changesByType"]').find("center").css("width","50%");
            $('a[name="changesByType"]').find("center").addClass("fix-width");
            $('a[name="changesByType"]').find("hr").remove();
            $('a[name="effectsFuncClass"]').find("table").css("width","100%");
            $('a[name="effectsFuncClass"]').find("hr").remove();
            let variantsByType = $('a[name="changesByType"]').html();
            let effectsByFunctionalClass = $('a[name="effectsFuncClass"]').html();
            let sumData = `<div class="fix-display" style="display: flex;">` + variantsByType + effectsByFunctionalClass + `</div><hr>`;
            let variations = `<center>` + $('a[name="effects"] p:nth-child(3)').html() + `</center><hr>`;
            let effectsByRegion = `<center><table border=0>` + $('a[name="effects"] table').find('table:eq(1)').html() + `</table></center><hr>`;
            let tstv = $('a[name="tstv"]').html();
            let data = style + sumData + variations + effectsByRegion + tstv
            return res.json({ status: "success", html: data}) 
        })
        .catch(function(err) {
            console.log(err);
            return res.json({ status: "error"}) 
        })
	},

    test: (req,res) => {
        let db;
        MongodbService.mongodbConnect()
            .then(function (mdb) {
                db = mdb;
                let database = db.db('genomics');
                database.collection('analysis_collection_1').find().toArray((err, results) => {
                    if(err) throw err;
                    console.log(results)
                    results.forEach(e => {

                    })
                });
            })
    }

};

