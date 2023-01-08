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

function togglePopup() {
	document.getElementById("popup-1").classList.toggle("active");
}
window.addEventListener("scroll", reveal);
function reveal() {
	var reveals = document.querySelectorAll(".reveal");
	for (var i = 0; i < reveals.length; i++) {
		var windowheight = window.innerHeight;
		var revealtop = reveals[i].getBoundingClientRect().top;
		var revealpoint = 150;

		if (revealtop < windowheight - revealpoint) {
			reveals[i].classList.add("active");
		} else {
			reveals[i].classList.remove("active");
		}
	}
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
function togglePopupR() {
	let spinnerWrapper = document.querySelector(".spinner-wrapper");
	window.addEventListener("load", function () {
		spinnerWrapper.style.display = "none";
	});
	document.getElementById("popup-2").classList.toggle("active");
}

auth.onAuthStateChanged((user) => {
	if (user) {
		console.log("User logged in");
	} else {
		console.log("user logged out");
	}
});

window.addEventListener("load", function () {
	const loginForm = document.querySelector("#login");
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		var spinner = document.getElementById("overlay");
		spinner.style.display = "block";
		//get user infor

		var email = loginForm["Email"].value;
		var password = loginForm["Password"].value;

		auth.signInWithEmailAndPassword(email, password)
			.then((cred) => {
				location.href = "profile.html";
				signForm.reset();
			})
			.catch(function (error) {
				swal(
					"Error!",
					"Email or Password is wrong! or User not Registered! ",
					"error"
				);
				spinner.style.display = "none";
			});
	});

	const signForm = document.querySelector("#sign");
	signForm.addEventListener("submit", (e) => {
		e.preventDefault();
		var spinner = document.getElementById("overlay");
		spinner.style.display = "block";
		//get user infor
		var name = signForm["fullname"].value;
		if (name == "") {
			swal("Missing Input Error!", "Enter Name", "error");
			spinner.style.display = "none";
			return false;
		}
		var surname = signForm["surname"].value;
		if (surname == "") {
			swal("Missing Input Error!", "Enter Surname", "error");
			spinner.style.display = "none";
			return false;
		}
		var title = signForm["Title"].value;
		if (title == "none") {
			swal("Missing Input Error!", "Select Title", "error");
			spinner.style.display = "none";
			return false;
		}
		var cellnumber = signForm["cellnumber"].value;
		if (cellnumber == "") {
			swal("Missing Input Error!", "Enter Cellphone Number", "error");
			spinner.style.display = "none";
			return false;
		}

		if (/^\d{10}$/.test(cellnumber)) {
			// value is ok, use it
		} else {
			swal(
				"Invalid Input Error!",
				"Enter 10 Digits values only",
				"error"
			);
			spinner.style.display = "none";
			signForm.focus();
			return false;
		}
		var email = signForm["Email"].value;
		if (email == "") {
			swal("Missing Input Error!", "Enter Email Address", "error");
			spinner.style.display = "none";
			return false;
		}
		var password = signForm["Password"].value;
		if (password == "") {
			swal(
				"Missing Input Error!",
				"Enter Password & Confirm Password",
				"error"
			);
			spinner.style.display = "none";
			return false;
		}
		if (password.length < 8) {
			swal(
				"Missing Input Error!",
				"Password Must be Equal or more Than 8 Charecters",
				"error"
			);
			spinner.style.display = "none";
			return false;
		}
		if (password.length > 15) {
			swal(
				"Missing Input Error!",
				"Password Must not be more Than 15 Charecters",
				"error"
			);
			spinner.style.display = "none";
			return false;
		}
		var defaullPicture = "img/defaults/dfault.png";
		var Live = "";
		var Loca = "";
		var atStudy = "";
		var Qua = "";
		var abt = "";
		var ConfPass = signForm["confPassword"].value;
		if (password == ConfPass) {
			auth.createUserWithEmailAndPassword(email, password).then(
				(cred) => {
					var userRef = firebase
						.firestore()
						.collection("users")
						.doc(firebase.auth().currentUser.uid);
					var setWithMerge = userRef.set({
						Email: email,
						Cell_Number: cellnumber,
						Surname: surname,
						Name: name,
						Title: title,
						Profile_Image: defaullPicture,
						LiveIN: Live,
						Location: Loca,
						StudiedAt: atStudy,
						HighestQualification: Qua,
						AboutMe: abt,
					});
					setTimeout(function () {
						window.location.href = "profile.html";
					}, 1600);

					signForm.reset();
				}
			);
		} else {
			swal(
				"Error!",
				"Password does not match! Please Re-Enter Your Password ",
				"error"
			);
			spinner.style.display = "none";
		}
	});
});
