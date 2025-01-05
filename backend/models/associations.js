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
Tracks.belongsTo(Genres, { foreignKey: "genre_id" });

Playlists.belongsTo(Users, { foreignKey: "creator_id"});
Users.hasMany(Playlists, { foreignKey: "creator_id" });

Playlists.belongsToMany(Tracks, {
	through: PlaylistTracks,
	foreignKey: "playlist_id",
});
Tracks.belongsToMany(Playlists, {
	through: PlaylistTracks,
	foreignKey: "track_id",
});

Tracks.belongsTo(Users, { foreignKey: "artist_id" });
Users.hasMany(Tracks, { foreignKey: "artist_id" });

Tracks.belongsToMany(Users, {
	through: Collaborations,
	foreignKey: "track_id",
});
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
