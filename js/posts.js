function Post() {
	auth.onAuthStateChanged((user) => {
		if (user) {
			db.collection("users")
				.doc(user.uid)
				.get()
				.then((data) => {
					var name = data.data().Name + " " + data.data().Surname;
					var pImage = data.data().Profile_Image;
					var postContent =
						document.getElementById("whatIPost").value;
					var d = new Date();
					var time = d.getTime();

					db.collection("Post").add({
						PostDescription: postContent,
						TimeStamps: time,
						UserName: name,
						UserImage: pImage,
						UserID: user.uid,
						PostVideo: null,
						PostImage: null,
					});
				})
				.then(() => {
					document.getElementById("whatIPost").value = "";
					getPost();
					getAllPost();
				});
		} else {
			console.log("user logged out");
		}
	});
}
function getPost() {
	auth.onAuthStateChanged((user) => {
		if (user) {
			let html = "";
			let div = "";
			const postedData = document.querySelector("#main");
			db.collection("users")
				.doc(user.uid)
				.onSnapshot((snapUser) => {
					userNameSurname =
						snapUser.data().Name + " " + snapUser.data().Surname;

					db.collection("Post")
						.orderBy("TimeStamps", "desc")
						.get()
						.then((snapshot) => {
							snapshot.forEach((data) => {
								if (user.uid == data.data().UserID) {
									var Liked = false;
									var counterL = 0;
									db.collection("Post")
										.doc(data.id)
										.collection("Likes")
										.get()
										.then((snapshot) => {
											snapshot.forEach((document) => {
												counterL += 1;
												if (
													document.data().Like ==
													user.uid
												) {
													Liked = true;
												}
											});
										})
										.then(() => {
											div = `                      
                                    <div class="row text-center profile-det mt-5 border"style="background-color:rgb(51, 51, 51);">
									
                                    <div class="profi  text-right">
                                        <img src="${
											snapUser.data().Profile_Image
										}" class="image-profile-post">
                                        </div>
                                            <div class="col-9  text-left">
                                                <div class="name-posted ">
                                                <span style="font-weight: lighter; color: white;">${userNameSurname}</span> <br>
                                                <span style="font-weight: lighter; font-size: smaller; color:gray">${moment(
													new window.Date(
														data.data().TimeStamps
													)
												).fromNow()} &bull; <i class="fas fa-globe-americas"></i></span>
                                            </div>
                                            </div>
											<div class="mt-2" style="width:100%; background-color: rgb(236, 231, 231); box-shadow: -5px 5px 10px 0 rgba(212, 208, 208, 0.979);border-bottom-radius:7px">
														
                                            <div class="col-11 p-3 postDiv mt-3 mb-3  text-left" style=" text-decoration: none; color:gray; cursor: pointer;background-color: white; border-radius:7px; ">
                                            <span>${
												data.data().PostDescription !==
												null
													? data.data()
															.PostDescription
													: ""
											}</span>
											${
												data.data().PostImage !== null
													? ` 
                                            <div class="col-12  mb-4  text-left postrrr">       
                                                <div class="posted-image-div border">
                                                    <img src="${
														data.data().PostImage
													}" alt="" class="posted-image img-fluid">
                                                </div>
                                            </div>
                                                `
													: ""
											} 
                                            </div>
                                            
                                                <div class="col-10 icon-div1  pt-2 pb-2 rounded-pill"  style="text-decoration: none; color:gray; cursor: pointer;background-color: rgb(236, 231, 231); box-shadow: -5px 5px 10px 0 rgba(212, 208, 208, 0.979);">
                                                ${
													Liked
														? `<span class="mx-4 icon-post2"><i class='fas fa-heart Liked fa-lg'></i> ${counterL}</span>`
														: `<span class="mx-4 icon-post2" ><i class='far fa-heart fa-lg' onclick="Liked('${data.id}')" ></i> ${counterL}</span>`
												}
                                               
                                                <span class="mx-4 icon-post2" ><i class="far fa-comment-alt" ></i> 1 Comment</span>
                                                <span class="mx-4 icon-post2">Share <i class="fas fa-share"></i></span>
                                            
                                                </div>
                                                <div class="col-10 text-center icon-div1  pt-2 mt-2 pb-4">
                                                <a href="#" style="text-decoration: none; color:gray; cursor: pointer;background-color: rgb(236, 231, 231); box-shadow: -2.5px 2.5px 5px 0 rgba(212, 208, 208, 0.979);"  class=" p-1 rounded-pill"><span  onclick="viewComment('${
													data.id
												}')">View Comments</span></a>
                                            
                                                </div>
												</div>
                                            </div>
                                    `;
											html += div;
											postedData.innerHTML = html;
										});
								}
							});
						});
				});
		}
	});
}

function Liked(postId) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			document.body.style.cursor = "wait";
			var flag = false;
			db.collection("Post")
				.doc(postId)
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
						db.collection("Post")
							.doc(postId)
							.collection("Likes")
							.add({
								Like: user.uid,
							})
							.then(() => {
								document.body.style.cursor = "default";
								getPost();
							});
					} else {
						console.log("Already Liked");
						document.body.style.cursor = "default";
					}
				});
		}
	});
}
function Liked1(postId) {
	auth.onAuthStateChanged((user) => {
		if (user) {
			document.body.style.cursor = "wait";
			var flag = false;
			db.collection("Post")
				.doc(postId)
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
						db.collection("Post")
							.doc(postId)
							.collection("Likes")
							.add({
								Like: user.uid,
							})
							.then(() => {
								document.body.style.cursor = "default";
								showPost();
							});
					} else {
						console.log("Already Liked");
						document.body.style.cursor = "default";
					}
				});
		}
	});
}

function viewComment(id) {
	window.location.href = "comments.html?post=" + id + "";
}
function showPost() {
	const query = window.location.search;
	const url = new URLSearchParams(query);
	const key = url.get("post");
	console.log(key);

	auth.onAuthStateChanged((user) => {
		if (user) {
			let html = "";
			let div = "";
			const postedData = document.querySelector("#main");
			db.collection("users")
				.doc(user.uid)
				.onSnapshot((snapUser) => {
					userNameSurname =
						snapUser.data().Name + " " + snapUser.data().Surname;

					db.collection("Post")
						.doc(key)
						.get()
						.then((data) => {
							if (user.uid == data.data().UserID) {
								var Liked = false;
								var counterL = 0;
								db.collection("Post")
									.doc(data.id)
									.collection("Likes")
									.get()
									.then((snapshot) => {
										snapshot.forEach((document) => {
											counterL += 1;
											if (
												document.data().Like == user.uid
											) {
												Liked = true;
											}
										});
									})
									.then(() => {
										div = `                      
                                    <div class="row text-center profile-det mt-3 border">
                                    <div class="profi  text-right">
                                        <img src="${
											snapUser.data().Profile_Image
										}" class="image-profile-post">
                                        </div>
                                            <div class="col-9  text-left">
                                                <div class="name-posted ">
                                                <span>${userNameSurname}</span> <br>
                                                <span style="font-weight: lighter; font-size: smaller;">${moment(
													new window.Date(
														data.data().TimeStamps
													)
												).fromNow()} &bull; <i class="fas fa-globe-americas"></i></span>
                                            </div>
                                            </div>
                                    
                                            <div class="col-11  postDiv mt-3 mb-4  text-left">
                                            <span>${
												data.data().PostDescription !==
												null
													? data.data()
															.PostDescription
													: ""
											}</span>
                                            </div>
                                            ${
												data.data().PostImage !== null
													? ` 
                                            <div class="col-11  postDiv mt-3 mb-4  text-left">       
                                                <div class="posted-image-div">
                                                    <img src="${
														data.data().PostImage
													}" alt="" class="posted-image">
                                                </div>
                                            </div>
                                                `
													: ""
											}  
                                                <div class="col-10 icon-div1 border pt-2 pb-2">
                                                ${
													Liked
														? `<span class="mx-4 icon-post2"><i class='fas fa-heart Liked fa-lg'></i> ${counterL}</span>`
														: `<span class="mx-4 icon-post2"><i class='far fa-heart fa-lg' onclick="Liked1('${data.id}')"></i> ${counterL}</span>`
												}
                                               
                                                <span class="mx-4 icon-post2"><i class="far fa-comment-alt"></i> 1 Comment</span>
                                                <span class="mx-4 icon-post2">Share <i class="fas fa-share"></i></span>
                                            
                                                </div>
                                            </div>
                                    `;
										html += div;
										postedData.innerHTML = html;
									});
							}
						});
				});
		}
	});
}
function postComment() {
	auth.onAuthStateChanged((user) => {
		const query = window.location.search;
		const url = new URLSearchParams(query);
		const key = url.get("post");

		if (user) {
			var userComment = document.getElementById("placeComment").value;
			var d = new Date();
			var time = d.getTime();

			db.collection("Post")
				.doc(key)
				.collection("Comments")
				.add({
					Comment: userComment,
					TimeStamps: time,
					UserID: user.uid,
				})
				.then(() => {
					console.log("Commented");
					getComment();
					document.getElementById("placeComment").value = "";
				});
		} else {
			console.log("user logged out");
		}
	});
}
function getComment() {
	const query = window.location.search;
	const url = new URLSearchParams(query);
	const key = url.get("post");
	let div = "";
	let html = "";
	const postedComment = document.querySelector("#commentsContainer");

	db.collection("Post")
		.doc(key)
		.collection("Comments")
		.orderBy("TimeStamps", "desc")
		.get()
		.then((snapshot) => {
			snapshot.forEach((data) => {
				console.log(data.data());

				div = `
				<div class="col-12">
					<span class="userName"> Chris:</span
					><span class="userComment"> ${data.data().Comment}</span>
					<span class="timeStamp">${moment(
						new window.Date(data.data().TimeStamps)
					).fromNow()}</span>
				</div>
				`;
				html += div;
				console.log(html);
				postedComment.innerHTML = html;
			});
		});
}
auth.onAuthStateChanged((user) => {
	if (user) {
		var imgURL;
		var files = [];
		var reader;

		var date = new Date();
		var time = date.getTime();
		//change profile picture
		document.getElementById("select2").onclick = function () {
			var input = document.createElement("input");
			input.type = "file";

			input.onchange = (e) => {
				files = e.target.files;
				reader = new FileReader();
				reader.onload = function () {
					document.getElementById("myPicture2").src = reader.result;
				};
				reader.readAsDataURL(files[0]);
			};
			input.click();
		};

		document.getElementById("change2").onclick = function () {
			const ref = firebase.storage().ref("UserPosts/");
			const picture = files[0];
			const name = +new Date() + "-" + picture.name;
			const metadata = {
				contentType: picture.type,
			};
			const task = ref.child(name).put(picture, metadata);

			task.on(
				"state_change",
				function (snapshot) {
					var progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					document.getElementById("UpProgress2").innerHTML =
						"Posting " + progress.toFixed(0) + "%";
				},
				function (error) {
					alert("Error in saving the image");
				},

				function () {
					task.snapshot.ref.getDownloadURL().then(function (url) {
						imgURL = url;
						var desc = document.getElementById("myMind2").value;

						db.collection("Post").add({
							PostDescription: desc,
							TimeStamps: time,
							UserID: user.uid,
							PostVideo: null,
							PostImage: imgURL,
						});
						document.getElementById("UpProgress").innerHTML = "";
						Swal.fire(
							{
								position: "top",
								icon: "success",
								title: "Posted Successfully",
								showConfirmButton: false,
								width: "20rem",
								confirmButtonColor: "#cfb53b",
								timer: 1500,
							},
							setTimeout(function () {
								window.location.href = "profile.html";
							}, 1700)
						);
						console.log(desc);
					});
				}
			);
		};
	} else {
		console.log("user logged out");
	}
});
