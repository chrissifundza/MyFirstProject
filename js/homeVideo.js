db.collection("VideoList").onSnapshot((snapshot) => {
	CreateListb(snapshot.docs);
});

const videoListb = document.querySelector(".parent");

const CreateListb = (data) => {
	let html = "";

	data.forEach((doc) => {
		const vid = { id: doc.id, ...doc.data() };
		div = `                      
            <div class="col-md-3 pt-2 pb-2" onclick="display('${vid.id}')">
                <div class="embed-responsive ">
                    <img src="${
						vid.PhotoUrl
					}"  class="img-fluid image-respond" > 
                </div>
                <div class="row text-left">
                    <div class="col-2   profi">
                      <img src="img/profile.jpg" class=" image-pro">
                    </div>
                <div class="col-9  profi2"> <h6 class="pt-3 font-weight-bold twoline-rext" style="color:rgb(230, 221, 221);font-family: Arial, Helvetica, sans-serif;cursor: pointer; font-size:15px" >${
					vid.Title
				}</h6>
                      <div class="member-profile2">
                          <span class="" style="color:#b6b6b1;top: 8px; ">Living Christ Life <i class="fa fa-check-circle" aria-hidden="true"></i></span><br>
                          <span style="color:#b6b6b1;"> ${
								vid.Views
							} Views &bull; ${moment(
			new window.Date(doc.data().Time)
		).fromNow()} </span>
                      </div>
                </div>
                <div class=" col-lg-11 col-md-6 channel">
                </div>
               
                
              </div>
            </div>
          `;
		html += div;
	});
	videoListb.innerHTML = html;
};
