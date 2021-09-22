'use strict'


module.exports = {
    updateStatusSample: () => {
        let queryStr = `
        UPDATE samples 
            SET samples.complete_status = 1 
        WHERE samples.id IN 
            (SELECT tbl1.sample_id FROM 
            (SELECT COUNT(id) as countUpload, sample_id FROM uploads WHERE sample_id in 
            (SELECT id FROM samples WHERE complete_status = 0) GROUP BY sample_id) as tbl1 
            INNER JOIN (SELECT COUNT(id) as countComplete, sample_id FROM uploads WHERE sample_id in 
            (SELECT id FROM samples WHERE complete_status = 0) AND uploads.upload_status = 1 GROUP BY sample_id) as tbl2 
            WHERE tbl1.sample_id = tbl2.sample_id AND tbl1.countUpload = tbl2.countComplete)`

            
        Samples.getDatastore().sendNativeQuery(queryStr)
            .then(data => {
                return true;
            })
            .catch(err => {
                console.log(err)
            })
    }
}