export const renderVideo = (video, poster) => {
	return (
		<video
			autoPlay
			loop
			muted
			playsInline
			poster={poster}
			style={{ objectFit: 'cover', width: '100%', height: '100%' }}>
			<source
				src={video}
				type='video/mp4'
			/>
		</video>
	)
}
