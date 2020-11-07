const header = document.querySelector("#header");
const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");
const sections = document.querySelectorAll("section")
const navbarItems = document.querySelectorAll("#nav-menu li a")
const galleryBody = document.querySelector(".gallery-body");
const currentYear = document.querySelector("#currentYear");
const hiddenPhotos = document.querySelectorAll("#hiddenPhotos");
const artistInfos = document.querySelectorAll(".artist-info");
const faqContainer = document.querySelector("#accordionContainer");
const contactForm = document.getElementById("contactForm");
const submitButton = document.querySelector("#submit-button button");
const formStatusMessage = document.querySelector("#form-status-message");


// Trottle function to be used to limit amount of event   calls
const throttle = (func, limit) => {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Make navbar sticky and add background when scrolling down
document.addEventListener("scroll", e => {
  if (window.scrollY >= 200) {
    header.classList.add("scrolled");
  } else if (!hamburger.classList.contains("active")) {
    header.classList.remove("scrolled");
  }
})

// Navbar scrolling state 
const navbarScrollToggle = throttle(() => {
  let fromTop = window.scrollY + 60;
  for (let link of navbarItems) {
    let section = document.querySelector(link.hash);
    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  }
}, 100);
window.addEventListener("scroll", navbarScrollToggle);

// Hamburger nav button
hamburger.addEventListener("click", e => {
  if (header.classList.contains("scrolled")
    && !navMenu.classList.contains("show")) {
    navMenu.classList.toggle("show");
  } else if (header.classList.contains("scrolled")
    && navMenu.classList.contains("show")
    && window.scrollY >= 200) {
    navMenu.classList.toggle("show");
  } else {
    header.classList.toggle("scrolled");
    navMenu.classList.toggle("show");
  }
  hamburger.classList.toggle("active");
});

document.body.addEventListener("click", e => {
  if (hamburger.classList.contains("active")) {
    if (e.target.offsetParent !== navMenu && e.target.offsetParent !== header) {
      if (header.classList.contains("scrolled")
        && navMenu.classList.contains("show")
        && window.scrollY >= 200) {
        navMenu.classList.remove("show");
      } else {
        header.classList.remove("scrolled");
        navMenu.classList.remove("show");
      }
      hamburger.classList.toggle("active");
    }
  }
});

// Google Maps
// Initialize and add the map
function initMap() {
  var lostworld = { lat: 51.771185, lng: 0.119950 };
  var map = new google.maps.Map(
    document.getElementById('map'), { zoom: 15, center: lostworld });
  var marker = new google.maps.Marker({ position: lostworld, map: map });
}

// Insta feed
const getInstaPosts = (user, callback) => {
  fetch(`https://www.instagram.com/${user}?__a=1`)
    .then(response => response.json())
    .then(data => callback(data.graphql.user.edge_owner_to_timeline_media.edges))
}

getInstaPosts("lostworldtattoos", (results) => {
  const media = [];
  results.forEach(item => {
    // First checks that the item isn't a video, then checks if it is a sidecar (more than one image) type.
    // If so it loops through all the posts images, checks that they're not videos and then adds them.
    if (item.node.is_video !== true) {
      if (item.node.__typename === "GraphSidecar") {
        item.node.edge_sidecar_to_children.edges.forEach(item => {
          if (item.node.is_video !== true) {
            media.push(item.node);
          }
        });
      } else {
        media.push(item.node);
      }
    }
  })
  media.forEach(item => {
    let col = document.createElement("div");
    col.className = "col-lg-3 col-md-4";
    let container = document.createElement("div");
    container.className = "tattoo";
    let img = document.createElement("img");
    img.src = item.display_url;
    let link = document.createElement("a");
    link.href = `https://www.instagram.com/p/${item.shortcode}/`;
    link.target = "_blank";
    link.appendChild(img);
    container.appendChild(link);
    col.appendChild(container);
    galleryBody.appendChild(col);
  });
});

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true
});
$(document).ready(function () {
  bsCustomFileInput.init()
})

// Footer year
currentYear.innerHTML = new Date().getFullYear();

// Lightbox
$(document).on('click', '[data-toggle="lightbox"]', function (event) {
  event.preventDefault();
  $(this).ekkoLightbox();
});

// Biancas portfolio
getInstaPosts("biancas_tattoos", (results) => {
  results.forEach((item, index) => {
    if (index === 0) {
      let button = document.createElement("button");
      button.className = "btn btn-sm";
      button.dataset.toggle = "lightbox";
      button.dataset.gallery = "hidden-images-bianca";
      button.dataset.remote = item.node.display_url;
      button.textContent = `View artist's latest work`;
      artistInfos[0].insertBefore(button, hiddenPhotos[0]);
      return;
    }
    let photo = document.createElement("div");
    photo.dataset.toggle = "lightbox";
    photo.dataset.gallery = "hidden-images-bianca";
    photo.dataset.remote = item.node.display_url;
    hiddenPhotos[0].appendChild(photo);
  });
});

// Sams portfolio
getInstaPosts("sameastwick", (results) => {
  results.forEach((item, index) => {
    if (index === 0) {
      let button = document.createElement("button");
      button.className = "btn btn-sm";
      button.dataset.toggle = "lightbox";
      button.dataset.gallery = "hidden-images-sam";
      button.dataset.remote = item.node.display_url;
      button.textContent = `View artist's latest work`;
      artistInfos[1].insertBefore(button, hiddenPhotos[1]);
      return;
    }
    let photo = document.createElement("div");
    photo.dataset.toggle = "lightbox";
    photo.dataset.gallery = "hidden-images-sam";
    photo.dataset.remote = item.node.display_url;
    hiddenPhotos[1].appendChild(photo);
  });
});

// FAQs
const faqs = [
  {
    question: "I would like to get a tattoo, how do I start the process?",
    answer: "First it’s best to have an idea of what you want, and any relevant images. We can then book you a consultation with your chosen artist, and the artist will take through some design ideas and begin the booking process with you."
  },
  {
    question: "How should I prepare for my tattoo?",
    answer: "You should get a good nights sleep, eat plenty of food, and bring a sugary drink/snacks with you. Please make sure your clean, especially the tattoo area, and you’re wearing appropriate clothing. Please don’t be drunk, high, be on blood thinning tablets, or ill. Any reason why we think you’re not in a suitable state we can refuse to tattoo you."
  },
  {
    question: "How old do I have to be?",
    answer: "You have to be 18, anything under is illegal even with permission."
  },
  {
    question: "What’s your minimum charge?",
    answer: "Our minimum charge is £40, this is what it costs to set up and block out a slot."
  },
  {
    question: "How much does a tattoo cost?",
    answer: "Each tattoo varies in price depending on many factors. If you book a consultation with an artist or pop in we can give you a rough quote on the day."
  },
  {
    question: "Does it hurt?",
    answer: "Everyone’s pain threshold is subjective, and also every place on the body is different! If your nervous you can use a numbing cream, or book smaller sessions."
  },
  {
    question: "What will happen in my appointment?",
    answer: "You will firstly have to fill out a form to make sure you understand the procedure and you meet our criteria. You will be called through when the artist is ready and the area will be prepped and the design applied. Once you have confirmed the design is what you want, the procedure will start, and once completed it will be dressed appropriately and you will be run through any aftercare."
  },
  {
    question: "What if I can’t make my appointment?",
    answer: "We require 48 hours notice for you to keep your deposit if you wish to move your appointment. Please call us as this reaches us immediately if you do not inform us and you miss your appointment your deposit will be taken."
  },
  {
    question: "How long does my tattoo take to heal?",
    answer: "On average around two weeks to stop shedding, but around four weeks for it to be fully healed. The better it’s looked after the better it will heal!"
  },
  {
    question: "How do I look after my tattoo?",
    answer: "We will run through with you a procedure of aftercare after your appointment, but we go on a basic procedure of cleaning and creaming it on an average of three times a day."
  },
  {
    question: "I think my tattoo is infected, what do I do?",
    answer: "Wash the whole area with an antibacterial wash and put a thin layer of savlon on it, and repeat this three times a day for two days. If it doesn’t get better please call us for a dive or consult a doctor."
  },
  {
    question: "Do you accept card?",
    answer: "It’s cash only, and there isn’t a card machine nearby so please come prepared."
  },
  {
    question: "Do you sell vouchers/gift cards?",
    answer: "Yes we do, you can purchase them in the shop with cash only."
  },
  {
    question: "Can I bring someone with me?",
    answer: "Due to the current climate we don’t allow any guests."
  }
];

faqs.forEach((item, i) => {
  const card = document.createElement("div");
  card.className = "card faq-item";
  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  cardHeader.id = `heading${i}`;
  const cardHeaderH2 = document.createElement("h2");
  cardHeaderH2.className = "mb-0";
  const cardHeaderButton = document.createElement("button");
  cardHeaderButton.className = "btn btn-link btn-block text-left collapsed"
  cardHeaderButton.type = "button";
  cardHeaderButton.dataset.toggle = "collapse";
  cardHeaderButton.dataset.target = `#collapse${i}`;
  cardHeaderButton.setAttribute('aria-expanded', true);
  cardHeaderButton.setAttribute('aria-controls', `collapse${i}`);
  cardHeaderButton.innerText = item.question;

  const cardBody = document.createElement("div");
  cardBody.id = `collapse${i}`;
  cardBody.className = "collapse";
  cardBody.setAttribute('aria-labelledby', `heading${i}`);
  cardBody.dataset.parent = "#accordionContainer";
  const cardBodyText = document.createElement("div");
  cardBodyText.className = "card-body";
  cardBodyText.innerText = item.answer;

  cardBody.appendChild(cardBodyText);
  cardHeaderH2.appendChild(cardHeaderButton);
  cardHeader.appendChild(cardHeaderH2)

  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  faqContainer.appendChild(card);

});



function email(data) {
  const message = document.getElementById("submit-button")
  fetch("./contact.php", {
    method: "POST",
    body: data,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      message.innerHTML = response.message;
    })
    .catch(error => {
      error.json().then(response => {
        formStatusMessage.innerText = response.message;
      })
    })
}


contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (grecaptcha.getResponse() == "") {
    formStatusMessage.innerText = "Please validate the reCaptcha form above first!";
  } else {
    submitButton.disabled = true;
    submitButton.style.opacity = '0.5';
    submitButton.innerText = "Sending...";
    formStatusMessage.innerText = "";
    const formData = new FormData(contactForm);
    email(formData);
  }
})