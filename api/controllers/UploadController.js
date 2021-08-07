


module.exports = {
    getSignedAuth: (req, res) => {
        let uploadName = req.body.uploadName;
        let fileType = req.body.fileType;
        let index = req.body.index;
        let user = req.user;

		let designation = `${sails.config.userFolder}/${user.id}/uploads/${uploadName}`;
        s3Service.getSignedUrl(designation, fileType)
            .then(result => {
                return res.json({ status: 'success', preSignedUrl: result, index: index });
            }).catch(error => {
                console.log("Error@UploadController-getSignedAuth: ", error);
                return res.json({ error: 'error' });
            })
	},

    uploadFileInfor: (req, res) => {
        let postFileInfor = req.body;
        let user = req.user;

        postFileInfor.user_created = user.id;
        postFileInfor.file_path = `${sails.config.userFolder}/${user.id}/uploads/${postFileInfor.upload_name}`;
        postFileInfor.is_deleted = 0;

        return Uploads.create(postFileInfor).fetch()
            .then(data => {
                if(data) {
                    return res.json({
                        status: 'success',
                        message: 'Uploaded files successfully!'
                    })
                }
                else {
                    let err = new Error('Error!');
                    err.isCustomError = true;
                    throw err
                }
            })
            .catch(error => {
				if(error.isCustomError) {
                    return res.json({
                        status: 'error',
                        message: error.message
                    })
                }
                else {
                    console.log(error);
                    return res.json({ status: 'error' })
                }
			})
    }

}