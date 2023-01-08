auth.onAuthStateChanged((user) => {
	if (user) {
		var docRef = db.collection("users").doc(auth.currentUser.uid);

		docRef.onSnapshot((doc) => {
			if (doc.exists) {
				//Output Profile Details

				document.getElementById("myprofPost").src =
					doc.data().Profile_Image;

				document.getElementById("namePost").innerHTML = doc.data().Name;

				document.getElementById("surnamePost").innerHTML =
					doc.data().Surname;
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		});
	} else {
		console.log("user logged out");
	}
});
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

					getAllPost();
				});
		} else {
			console.log("user logged out");
		}
	});
}
function getAllPost() {
	auth.onAuthStateChanged((user) => {
		if (user) {
			let html = "";
			let div = "";
			const postedData = document.querySelector("#main2");
			db.collection("users").onSnapshot((snapUser) => {
				db.collection("Post")
					.orderBy("TimeStamps", "desc")
					.get()
					.then((snapshot) => {
						snapshot.forEach((data) => {
							snapUser.forEach((doc) => {
								if (doc.id == data.data().UserID) {
									var userNameSurname =
										doc.data().Name +
										" " +
										doc.data().Surname;

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
                                    <div class="row text-center profile-det mt-3 border" style="background-color:rgb(51, 51, 51);">
                                    <div class="profi  text-right">
                                        <img src="${
											doc.data().Profile_Image
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
                                            <div class="col-12  mb-4  text-left postrrr" >       
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
														: `<span class="mx-4 icon-post2"><i class='far fa-heart fa-lg' onclick="Liked2('${data.id}')"></i> ${counterL}</span>`
												}
                                               
                                                <span class="mx-4 icon-post2"><i class="far fa-comment-alt"></i> 1 Comment</span>
                                                <span class="mx-4 icon-post2">Share <i class="fas fa-share"></i></span>
                                            
                                                </div>
                                                <div class="col-10 text-center icon-div1 mt-2 pt-2 pb-4">
                                                <a href="#" style="text-decoration: none; color:gray; cursor: pointer;background-color: rgb(236, 231, 231); box-shadow: -2.5px 2.5px 5px 0 rgba(212, 208, 208, 0.979);"  class=" p-1 rounded-pill"><span style="cursor: pointer;" onclick="viewComment('${
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
			});
		}
	});
}
function Liked2(postId) {
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
								getAllPost(postId);
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
if (window.innerWidth > 992) {
	document
		.querySelectorAll(".navbar .nav-item")
		.forEach(function (everyitem) {
			everyitem.addEventListener("mouseover", function (e) {
				let el_link = this.querySelector("a[data-bs-toggle]");

				if (el_link != null) {
					let nextEl = el_link.nextElementSibling;
					el_link.classList.add("show");
					nextEl.classList.add("show");
				}
			});
			everyitem.addEventListener("mouseleave", function (e) {
				let el_link = this.querySelector("a[data-bs-toggle]");

				if (el_link != null) {
					let nextEl = el_link.nextElementSibling;
					el_link.classList.remove("show");
					nextEl.classList.remove("show");
				}
			});
		});
}
// end if innerWidth
const logout = document.querySelector("#logout_profiletop");
logout.addEventListener("click", (e) => {
	e.preventDefault();

	auth.signOut().then(() => {
		console.log("user signed out");
		location.href = "index.html";
	});
});
