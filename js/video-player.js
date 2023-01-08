function uploadImage() {
	const ref = firebase.storage().ref("Videos/");
	const file2 = document.querySelector("#photo").files[0];
	const file = document.querySelector("#video").files[0];
	var fname = document.getElementById("description").value;
	var today = new Date();
	var time = today.getTime();
	var views = "0";
	let link = ["", ""];
	const name = +new Date() + "-" + file.name;
	const metadata = {
		contentType: file.type,
	};
	const name2 = +new Date() + "-" + file2.name2;
	const metadata2 = {
		contentType: file2.type,
	};
	const task = ref.child(name).put(file, metadata);
	task.on("state_changed", function progress(snapshot) {
		var percentage =
			(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		uploader.value = percentage;
	});

	const task2 = ref.child(name2).put(file2, metadata2);
	task2.on("state_changed", function progress(snapshot) {
		var percentage =
			(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		uploader.value = percentage;
	});

	task.then((snapshot) => snapshot.ref.getDownloadURL())
		.then((url) => {
			link[0] = url;
			console.log(link[0]);

			task2
				.then((snapshot) => snapshot.ref.getDownloadURL())
				.then((url) => {
					console.log(url);
					link[1] = url;

					db.collection("VideoList").add({
						Views: views,
						Time: time,
						Title: fname,
						VideoUrl: link[0],
						PhotoUrl: link[1],
					});
				});
		})
		.catch(console.error);
}

auth.onAuthStateChanged((user) => {
	if (user) {
		console.log("User logged in");
		var docRef = db.collection("users").doc(auth.currentUser.uid);

		docRef.onSnapshot((doc) => {
			if (doc.exists) {
				document.querySelector(".logout-profile").src =
					doc.data().Profile_Image;

				document.querySelector(".digi-profile").src =
					doc.data().Profile_Image;
				document.querySelector(".name-digi-pro").innerHTML =
					doc.data().Name;
				document.getElementById("myCommentProfile").src =
					doc.data().Profile_Image;
			}
		});
	} else {
		location.href = "index.html";
		console.log("user logged out");
	}
});

function display(id) {
	window.location.href = "play.html?video=" + id + "";
}

function onPlay() {
	const query = window.location.search;
	const url = new URLSearchParams(query);
	const vidkey = url.get("video");

	db.collection("VideoList")
		.doc(vidkey)
		.get()
		.then((snapshot) => {
			console.log("Running");
			const vid = { id: snapshot.id, ...snapshot.data() };

			document.getElementById("vidTitle").innerHTML = vid.Title;
			document.querySelector(".mytt").innerHTML = vid.Title;
			document.querySelector(".srcVideo").src = vid.VideoUrl;
			if (vid.Views == 1) {
				document.getElementById(
					"playViewTotal"
				).innerHTML = `${vid.Views} View`;
			} else {
				document.getElementById(
					"playViewTotal"
				).innerHTML = `${vid.Views} Views`;
			}

			document.getElementById("velek").innerHTML = ` &bull; ${moment(
				new window.Date(vid.Time)
			).fromNow()}`;
			document
				.querySelector(".videoss")
				.setAttribute("poster", vid.PhotoUrl);

			const videoPlayer = document.querySelector(".playingVideob");
			const video1 = videoPlayer.querySelector(".videoss");
			const playButton = document.querySelector(".play-button");
			const volume1 = document.querySelector(".volume");
			const currentTimeElement = document.querySelector(".current");
			const durationTimeElement = document.querySelector(".duration");
			const progress1 = document.querySelector(".video-progress1");
			const Videoplaying = document.querySelector(
				".video-progress-filled"
			);
			const mute = document.querySelector(".mute");
			const fullscreen = document.querySelector(".fullscreen");

			playButton.addEventListener("click", (e) => {
				if (video1.paused) {
					video1.play();
					e.target.innerHTML = `&#10074;&#10074;`;
				} else {
					video1.pause();
					e.target.innerHTML = `&#9658;`;
				}
			});
			volume1.addEventListener("mousemove", (e) => {
				video1.volume = e.target.value;
			});
			const currentTime = () => {
				let currentMinutes = Math.floor(video1.currentTime / 60);
				let currentSeconds = Math.floor(
					video1.currentTime - currentMinutes * 60
				);
				let durationMinutes = Math.floor(video1.duration / 60);
				let durationSeconds = Math.floor(
					video1.duration - durationMinutes * 60
				);
				currentTimeElement.innerHTML = `${currentMinutes}:${
					currentSeconds < 10 ? "0" + currentSeconds : currentSeconds
				}`;
				if (Number.isNaN(durationSeconds)) {
					durationTimeElement.innerHTML = "0.00";
				} else {
					durationTimeElement.innerHTML = `${durationMinutes}:${durationSeconds}`;
				}
				auth.onAuthStateChanged((user) => {
					if (user) {
						var flag = false;
						db.collection("VideoList")
							.doc(vidkey)
							.collection("VideoViews")
							.get()
							.then((snapshot) => {
								snapshot.forEach((document) => {
									if (document.data().View == user.uid) {
										flag = true;
									}
								});
							})
							.then(() => {
								if (!flag) {
									db.collection("VideoList")
										.doc(vidkey)
										.collection("VideoViews")
										.add({
											View: user.uid,
										})
										.then(() => {
											document.body.style.cursor =
												"default";
										});
								}
							});
					}
				});
			};
			video1.addEventListener("timeupdate", currentTime);
			video1.addEventListener("timeupdate", () => {
				const perce = (video1.currentTime / video1.duration) * 100;
				Videoplaying.style.width = `${perce}%`;
			});
			progress1.addEventListener("click", (e) => {
				const progressTime =
					(e.offsetX / progress1.offsetWidth) * video1.duration;
				video1.currentTime = progressTime;
			});

			mute.addEventListener("click", () => {
				video1.muted = !video1.muted;
				mute.classList.toggle("muted");
			});
			fullscreen.addEventListener("click", () => {
				video1.requestFullscreen();
			});
		});
	db.collection("VideoList")
		.doc(vidkey)
		.collection("VideoComments")
		.onSnapshot((snapshot) => {
			var counter = 0;
			snapshot.forEach((document) => {
				counter += 1;

				db.collection("VideoList").doc(vidkey).update(
					{
						TotalComments: counter,
					},
					{ merge: true }
				);
			});
		});

	db.collection("VideoList")
		.doc(vidkey)
		.onSnapshot((snap1) => {
			document.getElementById("totalCom").innerHTML =
				snap1.data().TotalComments + " Comments";
		});
}
function refresh() {
	const query = window.location.search;
	const url = new URLSearchParams(query);
	const vidkey = url.get("video");

	auth.onAuthStateChanged((user) => {
		if (user) {
			let html = "";
			let div = "";

			const postedKoment = document.querySelector("#koments");
			const CoutLikes = document.getElementById("countLikes11");
			db.collection("users").onSnapshot((doc) => {
				db.collection("VideoList")
					.doc(vidkey)
					.collection("VideoComments")
					.orderBy("TimeStamps", "desc")
					.onSnapshot((snap) => {
						snap.forEach((comm) => {
							doc.forEach((document) => {
								if (document.id == comm.data().UserID) {
									var userNameSurname =
										document.data().Name +
										" " +
										document.data().Surname;

									var Liked = false;
									var counterL = 0;
									var likedKey = "";
									db.collection("VideoList")
										.doc(vidkey)
										.collection("VideoComments")
										.doc(comm.id)
										.collection("Likes")
										.get()
										.then((snapshot) => {
											snapshot.forEach((document2) => {
												counterL += 1;

												if (
													document2.data().Like ==
													user.uid
												) {
													Liked = true;
												}
											});
										})
										.then(() => {
											div = ` 
											<div class="col-12  mt-4 border" style="border-color:transparent !important">
	<div class="col-11 old-comment">
		<img src="${document.data().Profile_Image}" alt="">
		<h6 style="padding-left: 5px; color: #b6b6b1;">${userNameSurname}, <span>&nbsp;&nbsp;&nbsp;${moment(
												new window.Date(
													comm.data().TimeStamps
												)
											).fromNow()}</span></h6>

	
	</div>
	<p style="margin-left:66px; margin-top: 0px; margin-right: 30px;color: #b6b6b1;">${
		comm.data().PostDescription
	}
	</p>
	<hr style="background-color:#535050!important;">
	<div  class="act col-md-6 text-right" style="float:right;color: #b6b6b1;">
	
	
 
	${
		Liked
			? `<span class="mx-4 icon-post2" style="cursor: pointer;"><i class='fas fa-heart Liked fa-lg'></i> ${counterL}</span>`
			: `<span class="mx-4 icon-post2" style="cursor: pointer;"><i class='far fa-heart fa-lg' onclick="Liked3('${comm.id}')"></i> ${counterL}</span>`
	}
		</div>
	</div>
											
                                   
                                    `;
											html += div;
											postedKoment.innerHTML = html;
										});
								}
							});
						});
					});
			});
		} else {
			console.log("user logged out");
		}
	});
}
function Liked3(likeID) {
	const query = window.location.search;
	const url = new URLSearchParams(query);
	const vidkey = url.get("video");

	auth.onAuthStateChanged((user) => {
		if (user) {
			document.body.style.cursor = "wait";
			var flag = false;
			db.collection("VideoList")
				.doc(vidkey)
				.collection("VideoComments")
				.doc(likeID)
				.collection("Likes")
				.get()
				.then((snapshot) => {
					snapshot.forEach((document) => {
						if (document.data().Like == user.uid) {
							flag = true;
						}
					});
				})
				.then(() => {
					if (!flag) {
						db.collection("VideoList")
							.doc(vidkey)
							.collection("VideoComments")
							.doc(likeID)
							.collection("Likes")
							.add({
								Like: user.uid,
							})
							.then(() => {
								document.body.style.cursor = "default";
								refresh();
							});
					} else {
						console.log("Already Liked");
						document.body.style.cursor = "default";
					}
				});
		}
	});
}
function VideoLikes() {
	const query = window.location.search;
	const url = new URLSearchParams(query);
	const vidkey = url.get("video");

	auth.onAuthStateChanged((user) => {
		if (user) {
			const topLikeV = document.querySelector(".videoTopLike");
			const CoutLikes = document.querySelector(".countLikes11");

			var Liked = false;
			var counterL = 0;
			db.collection("VideoList")
				.doc(vidkey)
				.collection("Likes")
				.get()
				.then((snapshot) => {
					snapshot.forEach((document2) => {
						counterL += 1;
						if (document2.data().Like == user.uid) {
							Liked = true;
							document.querySelector(
								".videoTopLike"
							).style.color = "rgb(56, 56, 236)";
						}
					});
				})
				.then(() => {
					CoutLikes.innerHTML = counterL;
					topLikeV.addEventListener("click", () => {
						Liked4(vidkey);
					});
				});
		} else {
			console.log("user logged out");
		}
	});
}
function Liked4(likeID) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			document.body.style.cursor = "wait";
			var flag = false;
			var count = document.querySelector(".countLikes11").innerHTML;

			db.collection("VideoList")
				.doc(likeID)
				.collection("Likes")
				.get()
				.then((snapshot) => {
					snapshot.forEach((document) => {
						if (document.data().Like == user.uid) {
							flag = true;
						}
					});
				})
				.then(() => {
					if (!flag) {
						db.collection("VideoList")
							.doc(likeID)
							.collection("Likes")
							.add({
								Like: user.uid,
							})
							.then(() => {
								document.body.style.cursor = "default";
								VideoLikes();
							});
					} else {
						console.log("Already Liked");

						document.body.style.cursor = "default";
					}
				});
		}
	});
}
function Comment1() {
	auth.onAuthStateChanged((user) => {
		if (user) {
			const query = window.location.search;
			const url = new URLSearchParams(query);
			const vidkey = url.get("video");

			const postofVideos = document.getElementById("postInVideo");
			postofVideos.addEventListener("click", () => {
				var postContent = document.getElementById("LPostVideo").value;
				console.log(postContent);
				var d = new Date();
				var time = d.getTime();

				db.collection("VideoList")
					.doc(vidkey)
					.collection("VideoComments")
					.add({
						PostDescription: postContent,
						TimeStamps: time,
						UserID: user.uid,
					});
				document.getElementById("LPostVideo").value = "";
				refresh();
			});
		}
	});
}
auth.onAuthStateChanged((user) => {
	if (user) {
		db.collection("VideoList")
			.get()
			.then((snapshot) => {
				playlist(snapshot.docs);
			});

		const list = document.querySelector(".list");

		const playlist = (data) => {
			let html = "";

			data.forEach((doc) => {
				const vid = { id: doc.id, ...doc.data() };
				var counterV = 0;
				db.collection("VideoList")
					.doc(vid.id)
					.collection("VideoViews")
					.get()
					.then((snapshot) => {
						snapshot.forEach((document) => {
							counterV += 1;
							db.collection("VideoList").doc(vid.id).update(
								{
									Views: counterV,
								},
								{ merge: true }
							);
							if (document.data().View == user.uid) {
								Viewed = true;
							}
						});
					});
				div = `             
                    <div class="col-md-12 pt-3 tp bmm" style="margin: 0 auto;" onclick="display('${
						vid.id
					}')">
                       <div class=" col-12 small-img-row bm text-wrap">
                              <div class=" col-md-6 small-img" style="margin-left: -30px!important;">
                                <img src="${
									vid.PhotoUrl
								}"  class=" playlist-image" alt="" >  
                              </div>
                              
                              <div class="tit text-wrap">
                                <div>
                                <h6 class=" font-weight-bold bmm twoline-rext" style="color:#3d3b3bf3; margin-left-10px;" >${
									vid.Title
								}</h6>
                                </div>
                                <span class="font-weight-bold bmmm" style="color:#3d3b3bf3 ; font-size: 12px;">Living Christ Life <i class="fa fa-check-circle" aria-hidden="true"></i></span><br>
                                <span class="bmmm" style="font-size: 12px;"> ${
									vid.Views
								} Views &bull; ${moment(
					new window.Date(doc.data().Time)
				).fromNow()}</span>  
                              </div>    
                        </div>
                    </div>
          `;

				html += div;
			});

			list.innerHTML = html;
		};
	}
});
function display(id) {
	window.location.href = "play.html?video=" + id + "";
}
function myFunction() {
	var x = document.getElementById("myDIV");
	if (x.style.display === "block") {
		x.style.display = "none";
	} else {
		x.style.display = "block";
	}
}
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
	e.preventDefault();
	var spinner = document.getElementById("overlay");
	spinner.style.display = "block";
	auth.signOut().then(() => {
		console.log("user signed out");
		location.href = "index.html";
	});
});
const logoutdown = document.querySelector("#log_out");
logoutdown.addEventListener("click", (e) => {
	e.preventDefault();
	var spinner = document.getElementById("overlay");
	spinner.style.display = "block";
	auth.signOut().then(() => {
		console.log("user signed out");
		location.href = "index.html";
	});
});
function onAddMember() {
	auth.onAuthStateChanged((user) => {
		if (user) {
			var flag = false;
			db.collection("Members")
				.get()
				.then((snapshot) => {
					snapshot.forEach((doc) => {
						if (user.uid == doc.data().JoinedChurch) {
							flag = true;
							document.querySelector(
								".added123"
							).style.backgroundColor = "#adaca6";
							document.querySelector(".added123").style.color =
								"black";
							document.querySelector(".added123").textContent =
								"Joined Church";
						}
					});
				})
				.then(() => {
					if (!flag) {
						db.collection("Members").add({
							JoinedChurch: user.uid,
						});
					}
				});
		} else {
			console.log("user logged out");
		}
	});
}
db.collection("Members").onSnapshot((snapshot) => {
	var counter = 0;
	snapshot.forEach((document) => {
		counter += 1;

		db.collection("Admin").doc("mainAdmin2021").update(
			{
				TotalMembers: counter,
			},
			{ merge: true }
		);
	});
});
auth.onAuthStateChanged((user) => {
	if (user) {
		var flag = false;
		db.collection("Members").onSnapshot((snapshot) => {
			snapshot.forEach((doc) => {
				if (user.uid == doc.data().JoinedChurch) {
					flag = true;
					document.querySelector(".added123").style.backgroundColor =
						"#adaca6";
					document.querySelector(".added123").style.color = "black";
					document.querySelector(".added123").textContent =
						"Joined Church";
				}
			});
		});
	} else {
		console.log("user logged out");
	}
});
db.collection("Admin")
	.doc("mainAdmin2021")
	.onSnapshot((snap) => {
		if (snap.data().TotalMembers == 1) {
			document.getElementById("addedMembersm").innerHTML =
				snap.data().TotalMembers + " Member";
		} else {
			document.getElementById("addedMembersm").innerHTML =
				snap.data().TotalMembers + " Members";
		}
	});
