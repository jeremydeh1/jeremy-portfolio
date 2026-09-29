const nodes = {
    internet: {
        title: "Internet / Client",
        text:
            "A browser request begins outside the AWS environment and must enter through the public-facing network path.",
        access: "External",
        port: "HTTP",
        role: "Request Source"
    },

    igw: {
        title: "Internet Gateway",
        text:
            "The Internet Gateway connects the VPC's public routing path to the internet. Public subnet routing sends internet-bound traffic through it.",
        access: "Public",
        port: "—",
        role: "VPC Gateway"
    },

    nginx: {
        title: "Public EC2 / Nginx",
        text:
            "The public Amazon Linux instance receives HTTP traffic and uses Nginx as a reverse proxy to reach the private application server.",
        access: "Public",
        port: "80",
        role: "Reverse Proxy"
    },

    app: {
        title: "Private EC2 / Application",
        text:
            "The application server has no public IPv4 address. Application traffic reaches it from the public EC2 instance over TCP 8080.",
        access: "Private",
        port: "8080",
        role: "Application"
    }
};


const architectureNodes =
    document.querySelectorAll(".architecture-node");

const inspectorTitle =
    document.getElementById("inspectorTitle");

const inspectorText =
    document.getElementById("inspectorText");

const detailAccess =
    document.getElementById("detailAccess");

const detailPort =
    document.getElementById("detailPort");

const detailRole =
    document.getElementById("detailRole");

const requestLog =
    document.getElementById("requestLog");

const requestButton =
    document.getElementById("requestButton");

const securityButton =
    document.getElementById("securityButton");

const lab =
    document.querySelector(".lab");

const packet =
    document.querySelector(".packet");


function selectNode(nodeName) {

    const data = nodes[nodeName];

    if (!data) {
        return;
    }

    architectureNodes.forEach((node) => {
        node.classList.toggle(
            "selected",
            node.dataset.node === nodeName
        );
    });

    inspectorTitle.textContent = data.title;
    inspectorText.textContent = data.text;

    detailAccess.textContent = data.access;
    detailPort.textContent = data.port;
    detailRole.textContent = data.role;
}


architectureNodes.forEach((node) => {

    node.addEventListener("click", () => {
        selectNode(node.dataset.node);
    });

});


selectNode("nginx");


/* =========================================================
   REQUEST ANIMATION
   ========================================================= */

let requestRunning = false;

const requestSequence = [
    {
        node: "internet",
        message: "Client → HTTP request begins"
    },
    {
        node: "igw",
        message: "Request enters the VPC through the Internet Gateway"
    },
    {
        node: "nginx",
        message: "Public EC2 receives TCP/80 → Nginx evaluates /app/"
    },
    {
        node: "app",
        message: "Nginx proxies request → Private EC2 :8080"
    }
];


function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}


async function animateRequest() {

    if (requestRunning) {
        return;
    }

    requestRunning = true;

    requestButton.disabled = true;
    requestButton.textContent = "Sending...";

    if (packet) {
        packet.classList.add("running");
    }

    for (const step of requestSequence) {

        selectNode(step.node);

        requestLog.textContent = step.message;

        await wait(850);
    }

    requestLog.textContent =
        "200 OK ← response returned through Nginx to the client";

    await wait(1000);

    if (packet) {
        packet.classList.remove("running");
    }

    requestButton.disabled = false;
    requestButton.textContent = "▶ Send Request";

    requestRunning = false;
}


requestButton.addEventListener("click", animateRequest);


/* =========================================================
   SECURITY VIEW
   ========================================================= */

securityButton.addEventListener("click", () => {

    const enabled =
        lab.classList.toggle("security-mode");

    securityButton.classList.toggle("active", enabled);

    if (enabled) {

        requestLog.textContent =
            "Security view: Internet access terminates at the public tier. The private application accepts internal traffic from the public EC2 security group.";

        selectNode("app");

    } else {

        requestLog.textContent =
            "Security view disabled — select a component or send a request.";

        selectNode("nginx");
    }

});


/* =========================================================
   TROUBLESHOOTING
   ========================================================= */

const troubleshooting = [
    {
        title: "Is Nginx actually running?",
        text:
            "Start at the service itself. I verified Nginx status before blaming AWS networking.",
        status: "Service operational"
    },

    {
        title: "Does HTTP work locally?",
        text:
            "I used curl from the instance itself. A successful local response proves the web service is listening before testing the external path.",
        status: "Local HTTP confirmed"
    },

    {
        title: "Is the security group allowing traffic?",
        text:
            "I checked inbound rules for the public server and verified the private application rules only allowed the required traffic from the public EC2 security group.",
        status: "Rules verified"
    },

    {
        title: "Does the subnet have the right route?",
        text:
            "I verified the public route table, Internet Gateway route, and subnet association to make sure the instance actually had a valid internet path.",
        status: "Route path verified"
    },

    {
        title: "Is the network ACL blocking it?",
        text:
            "After validating the route and security groups, I checked the subnet Network ACL as another possible filtering layer.",
        status: "ACL checked"
    },

    {
        title: "Can TCP port 80 be reached externally?",
        text:
            "Testing TCP/80 from outside the instance helped confirm whether the AWS network path to Nginx was actually reachable.",
        status: "External path confirmed"
    }
];


const troubleSteps =
    document.querySelectorAll(".trouble-step");

const troubleNumber =
    document.getElementById("troubleNumber");

const troubleTitle =
    document.getElementById("troubleTitle");

const troubleText =
    document.getElementById("troubleText");

const troubleStatus =
    document.getElementById("troubleStatus");


troubleSteps.forEach((button) => {

    button.addEventListener("click", () => {

        const index =
            Number(button.dataset.step);

        const step =
            troubleshooting[index];

        if (!step) {
            return;
        }

        troubleSteps.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        troubleNumber.textContent =
            `CHECK ${String(index + 1).padStart(2, "0")}`;

        troubleTitle.textContent =
            step.title;

        troubleText.textContent =
            step.text;

        troubleStatus.textContent =
            step.status;
    });

});


/* =========================================================
   SCROLL REVEALS
   ========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {
        observer.observe(element);
    });

} else {

    revealElements.forEach((element) => {
        element.classList.add("visible");
    });

}


/* =========================================================
   HERO DEPTH
   ========================================================= */

const heroVisual =
    document.querySelector(".visual-window");

const heroSection =
    document.querySelector(".hero");


if (
    heroVisual &&
    heroSection &&
    window.matchMedia("(pointer: fine)").matches
) {

    heroSection.addEventListener("mousemove", (event) => {

        const rect =
            heroSection.getBoundingClientRect();

        const x =
            (event.clientX - rect.left) / rect.width - 0.5;

        const y =
            (event.clientY - rect.top) / rect.height - 0.5;

        heroVisual.style.transform =
            `rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
    });


    heroSection.addEventListener("mouseleave", () => {

        heroVisual.style.transform =
            "rotateY(0deg) rotateX(0deg)";
    });

}