module.exports = {
	accessKey: process.env.accessKey,
	secretKey: process.env.secretKey,
	bucket: process.env.bucket,
	origin: process.env.origin,
	// timeout: 3600000, // default rpc timeout: one hour, optional
	// if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
	// uploadURL: 'http://up.qiniu.com/',
}
