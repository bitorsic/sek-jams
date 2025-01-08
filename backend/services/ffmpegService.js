const ffmpeg = require("fluent-ffmpeg");
const ffprobe = require('@ffprobe-installer/ffprobe');

ffmpeg.setFfprobePath(ffprobe.path);

const getAudioLength = (audioFile) => {
	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(audioFile.path, (err, metadata) => {
			if (err) return reject(err);
	
			const duration = metadata.format.duration;
			resolve(duration);
		});
	});
};

module.exports = {
	getAudioLength,
}