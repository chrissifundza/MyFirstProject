$(document).ready(function () {
	$(".sear-icon").click(function () {
		$(".search-form").slideToggle();
	});

	$(".close-search").click(function () {
		$(".search-form").slideToggle();
	});
	$(".menu-toggle").click(function () {
		$("nav").toggleClass("active");
	});
});

auth.onAuthStateChanged((user) => {
	if (user) {
		var docRef = db.collection("users").doc(auth.currentUser.uid);

		docRef.onSnapshot((doc) => {
			if (doc.exists) {
				//Output Profile Details
				document.getElementById("myPicture").src =
					doc.data().Profile_Image;
				document.getElementById("myprof").src =
					doc.data().Profile_Image;
				document.getElementById("myprofPost").src =
					doc.data().Profile_Image;

				document.getElementById("namePost").innerHTML = doc.data().Name;

				document.getElementById("surnamePost").innerHTML =
					doc.data().Surname;
				document.getElementById("headtop").innerHTML =
					doc.data().Name + " " + doc.data().Surname;
				document.getElementById("Ptitle").innerHTML = doc.data().Title;
				document.getElementById("Pname").innerHTML =
					doc.data().Name + " " + doc.data().Surname;
				document.getElementById("PCell").innerHTML =
					doc.data().Cell_Number;
				document.getElementById("Pemail").innerHTML = doc.data().Email;

				document.getElementById("fullname1").value = doc.data().Name;
				document.getElementById("surname1").value = doc.data().Surname;
				document.getElementById("Title1").value = doc.data().Title;
				document.getElementById("cellnumber1").value =
					doc.data().Cell_Number;
				document.getElementById("Email1").value = doc.data().Email;

				//Output Intro Details
				var t = doc.data().LiveIN;

				document.getElementById("town").innerHTML = doc.data().LiveIN;

				document.getElementById("subtown").innerHTML =
					doc.data().Location;
				document.getElementById("schoolattend").innerHTML =
					doc.data().StudiedAt;
				document.getElementById("qualification").innerHTML =
					doc.data().HighestQualification;
				document.getElementById("aboutme").innerHTML =
					doc.data().AboutMe;

				document.getElementById("liveIn").value = doc.data().LiveIN;
				document.getElementById("location").value = doc.data().Location;
				document.getElementById("studyAt").value = doc.data().StudiedAt;
				document.getElementById("qualification1").value =
					doc.data().HighestQualification;
				document.getElementById("aboutme1").value = doc.data().AboutMe;
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		});
		const updateForm = document.querySelector("#updateForm");
		updateForm.addEventListener("submit", (e) => {
			e.preventDefault();

			//get user infor
			var name1 = updateForm["fullname1"].value;
			if (name1 == "") {
				swal("Missing Input Error!", "Enter Name", "error");

				return false;
			}
			var surname1 = updateForm["surname1"].value;
			if (surname1 == "") {
				swal("Missing Input Error!", "Enter Surname", "error");

				return false;
			}
			var title1 = updateForm["Title1"].value;
			if (title1 == "none") {
				swal("Missing Input Error!", "Select Title", "error");

				return false;
			}
			var cellnumber1 = updateForm["cellnumber1"].value;
			if (cellnumber1 == "") {
				swal("Missing Input Error!", "Enter Cellphone Number", "error");

				return false;
			}

			if (/^\d{10}$/.test(cellnumber1)) {
				// value is ok, use it
			} else {
				swal(
					"Invalid Input Error!",
					"Enter 10 Digits values only",
					"error"
				);

				signForm.focus();
				return false;
			}
			var email1 = updateForm["Email1"].value;
			if (email1 == "") {
				swal("Missing Input Error!", "Enter Email Address", "error");

				return false;
			}

			db.collection("users")
				.doc(auth.currentUser.uid)
				.update(
					{
						Email: email1,
						Cell_Number: cellnumber1,
						Surname: surname1,
						Name: name1,
						Title: title1,
					},
					setTimeout(function () {
						window.location.href = "profile.html";
					}, 1700),
					Swal.fire({
						position: "center",
						icon: "success",
						title: "Updated Successfully",
						showConfirmButton: false,
						width: "20rem",
						confirmButtonColor: "#cfb53b",
						timer: 1500,
					})
				);
		});

		const updateForm2 = document.querySelector("#updateForm2");
		updateForm2.addEventListener("submit", (e) => {
			e.preventDefault();

			//get user infor
			var liveAt = updateForm2["liveIn"].value;
			var locationPlace = updateForm2["location"].value;
			var placeStudy = updateForm2["studyAt"].value;
			var HighestQuali = updateForm2["qualification1"].value;
			var aboutMyself = updateForm2["aboutme1"].value;

			db.collection("users")
				.doc(auth.currentUser.uid)
				.update(
					{
						LiveIN: liveAt,
						Location: locationPlace,
						StudiedAt: placeStudy,
						HighestQualification: HighestQuali,
						AboutMe: aboutMyself,
					},
					{ merge: true },
					function (error) {
						swal("Update Error!", "Something is Wrong", "error");
					},
					setTimeout(function () {
						window.location.href = "profile.html";
					}, 1700),
					Swal.fire({
						position: "center",
						icon: "success",
						title: "Updated Successfully",
						showConfirmButton: false,
						width: "20rem",
						confirmButtonColor: "#cfb53b",
						timer: 1500,
					})
				);
		});
	} else {
		console.log("user logged out");
	}
});
var imgURL;
var files = [];
var reader;
//change profile picture
document.getElementById("select").onclick = function () {
	var input = document.createElement("input");
	input.type = "file";

	input.onchange = (e) => {
		files = e.target.files;
		reader = new FileReader();
		reader.onload = function () {
			document.getElementById("myPicture").src = reader.result;
		};
		reader.readAsDataURL(files[0]);
	};
	input.click();
};
document.getElementById("change").onclick = function () {
	const ref = firebase.storage().ref("UserProfile/");
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
			document.getElementById("UpProgress").innerHTML =
				"Upload " + progress.toFixed(0) + "%";
		},
		function (error) {
			alert("Error in saving the image");
		},

		function () {
			task.snapshot.ref.getDownloadURL().then(function (url) {
				imgURL = url;

				var userRef = db.collection("users").doc(auth.currentUser.uid);
				var setWithMerge = userRef.set(
					{
						Profile_Image: imgURL,
					},
					{ merge: true }
				);
				document.getElementById("UpProgress").innerHTML = "";
				Swal.fire({
					position: "top",
					icon: "success",
					title: "Updated Successfully",
					showConfirmButton: false,
					width: "20rem",
					confirmButtonColor: "#cfb53b",
					timer: 1500,
				});
				setTimeout(function () {
					window.location.href = "profile.html";
				}, 1700);
			});
		}
	);
};

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
