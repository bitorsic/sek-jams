const { 
	Collaborations,
	Followers,
	Genres,
	PlaylistTracks,
	Playlists,
	Tracks,
	Users,
} = require(".");

Genres.hasMany(Tracks, { foreignKey: "genre_id" });

Playlists.belongsTo(Users);
Playlists.belongsToMany(Tracks, {
	through: PlaylistTracks,
	foreignKey: "playlist_id",
});

Tracks.belongsTo(Users);
Tracks.belongsToMany(Users, {
	through: Collaborations,
	foreignKey: "track_id",
});
Tracks.belongsToMany(Playlists, {
	through: PlaylistTracks,
	foreignKey: "track_id",
});
Tracks.belongsTo(Genres);

Users.hasMany(Tracks, { foreignKey: "user_id" });
Users.hasMany(Playlists, { foreignKey: "user_id" });
Users.belongsToMany(Tracks, {
	through: Collaborations,
	foreignKey: "artist_id",
});
Users.belongsToMany(Users, {
	through: Followers,
	as: "following",
	foreignKey: "followed_id",
	other: "follower_id"
});
Users.belongsToMany(Users, {
	through: Followers,
	as: "followedBy",
	foreignKey: "follower_id",
	other: "followed_id"
});
