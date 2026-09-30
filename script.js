/* =========================================================
   HERO SYSTEM MAP
   ========================================================= */

const heroNodeData = {
    internet: {
        label: "INTERNET",
        text:
            "A browser request begins outside the AWS environment and needs a valid path into the VPC."
    },

    edge: {
        label: "PUBLIC EDGE",
        text:
            "The Internet Gateway and public route provide the network path between the public subnet and the internet."
    },

    nginx: {
        label: "NGINX",
        text:
            "Public entry point that reverse-proxies application traffic into the private subnet."
    },

    app: {
        label: "PRIVATE APPLICATION",
        text:
            "The application runs on a private EC2 instance without a public IPv4 address and receives application traffic on TCP 8080."
    }
};


const heroNodes =
    document.querySelectorAll("[data-hero-node]");

const heroInsightLabel =
    document.getElementById("heroInsightLabel");

const heroInsight =
    document.getElementById("heroInsight");


const selectHeroNode = (name) => {
    const data = heroNodeData[name];

    if (!data) {
        return;
    }

    heroNodes.forEach((node) => {
        node.classList.toggle(
            "selected",
            node.dataset.heroNode === name
        );
    });

    heroInsightLabel.textContent =
        data.label;

    heroInsight.textContent =
        data.text;
};


heroNodes.forEach((node) => {
    node.addEventListener("click", () => {
        selectHeroNode(node.dataset.heroNode);
    });
});


selectHeroNode("nginx");


/* =========================================================
   PROJECT SELECTOR
   ========================================================= */

const projectTabs =
    document.querySelectorAll(".project-tab");

const projectPanels =
    document.querySelectorAll(".project-panel");


const selectProject = (projectName) => {

    projectTabs.forEach((tab) => {
        const selected =
            tab.dataset.project === projectName;

        tab.classList.toggle("active", selected);

        tab.setAttribute(
            "aria-selected",
            String(selected)
        );
    });


    projectPanels.forEach((panel) => {
        const selected =
            panel.dataset.panel === projectName;

        panel.classList.toggle("active", selected);

        panel.hidden = !selected;
    });

};


projectTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        selectProject(tab.dataset.project);
    });
});


/* =========================================================
   AWS ARCHITECTURE INSPECTOR
   ========================================================= */

const componentData = {
    internet: {
        title: "Internet / Client",
        description:
            "The request begins outside AWS and must reach the public network path before anything inside the VPC can respond.",
        exposure: "External",
        traffic: "HTTP",
        purpose: "Request origin",
        decision:
            "Treat the internet as an untrusted boundary. Only the services that need public access should be reachable from it."
    },

    igw: {
        title: "Internet Gateway",
        description:
            "The Internet Gateway attaches to the VPC and provides the public routing path used by resources in the public subnet.",
        exposure: "VPC edge",
        traffic: "IP routing",
        purpose: "Internet path",
        decision:
            "A subnet does not become public just because it exists. Its route table needs a path through the Internet Gateway."
    },

    nginx: {
        title: "Public EC2 / Nginx",
        description:
            "The public Amazon Linux instance receives HTTP traffic and uses Nginx to reverse-proxy application requests to the private server.",
        exposure: "Public",
        traffic: "TCP 80",
        purpose: "Reverse proxy",
        decision:
            "The public server handles the internet boundary while the application itself remains on a private instance."
    },

    app: {
        title: "Private EC2 / Application",
        description:
            "The application runs on the private EC2 instance and receives proxied traffic over TCP port 8080.",
        exposure: "Private",
        traffic: "TCP 8080",
        purpose: "Application tier",
        decision:
            "The application server does not need a public IPv4 address. Access can be constrained to traffic originating from the public EC2 security group."
    }
};


const architectureComponents =
    document.querySelectorAll(".architecture-component");

const componentTitle =
    document.getElementById("componentTitle");

const componentDescription =
    document.getElementById("componentDescription");

const componentExposure =
    document.getElementById("componentExposure");

const componentTraffic =
    document.getElementById("componentTraffic");

const componentPurpose =
    document.getElementById("componentPurpose");

const componentDecision =
    document.getElementById("componentDecision");


const selectArchitectureComponent = (name) => {

    const data = componentData[name];

    if (!data) {
        return;
    }


    architectureComponents.forEach((component) => {
        component.classList.toggle(
            "selected",
            component.dataset.component === name
        );
    });


    componentTitle.textContent =
        data.title;

    componentDescription.textContent =
        data.description;

    componentExposure.textContent =
        data.exposure;

    componentTraffic.textContent =
        data.traffic;

    componentPurpose.textContent =
        data.purpose;

    componentDecision.textContent =
        data.decision;
};


architectureComponents.forEach((component) => {
    component.addEventListener("click", () => {
        selectArchitectureComponent(
            component.dataset.component
        );
    });
});


selectArchitectureComponent("nginx");


/* =========================================================
   REQUEST TRACE
   ========================================================= */

const traceButton =
    document.getElementById("traceButton");

const architectureRoute =
    document.getElementById("architectureRoute");

const traceStatus =
    document.getElementById("traceStatus");

let traceRunning = false;


const traceSequence = [
    {
        component: "internet",
        message:
            "1/4 · Client creates an HTTP request."
    },

    {
        component: "igw",
        message:
            "2/4 · Traffic reaches the VPC through the Internet Gateway and public route."
    },

    {
        component: "nginx",
        message:
            "3/4 · Public EC2 receives TCP 80. Nginx handles the request and matches the application route."
    },

    {
        component: "app",
        message:
            "4/4 · Nginx forwards the request to the private application server on TCP 8080."
    }
];


const wait = (milliseconds) => {
    return new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
};


const clearTraceClasses = () => {
    architectureComponents.forEach((component) => {
        component.classList.remove("trace-active");
    });
};


const runTrace = async () => {

    if (traceRunning) {
        return;
    }


    traceRunning = true;

    traceButton.disabled = true;

    traceButton.firstChild.textContent =
        "Tracing ";


    architectureRoute.classList.remove("tracing");

    void architectureRoute.offsetWidth;

    architectureRoute.classList.add("tracing");


    for (const step of traceSequence) {

        clearTraceClasses();

        const component =
            document.querySelector(
                `[data-component="${step.component}"]`
            );

        if (component) {
            component.classList.add("trace-active");
        }

        selectArchitectureComponent(
            step.component
        );

        traceStatus.textContent =
            step.message;

        await wait(850);
    }


    clearTraceClasses();

    traceStatus.textContent =
        "Response path verified · the application response returns through Nginx to the client.";

    architectureRoute.classList.remove("tracing");

    traceButton.disabled = false;

    traceButton.firstChild.textContent =
        "Trace request ";

    traceRunning = false;
};


traceButton.addEventListener(
    "click",
    runTrace
);


/* =========================================================
   SECURITY VIEW
   ========================================================= */

const securityToggle =
    document.getElementById("securityToggle");

const architectureShell =
    document.querySelector(".architecture-shell");


securityToggle.addEventListener("click", () => {

    const enabled =
        architectureShell.classList.toggle(
            "security-view"
        );


    securityToggle.classList.toggle(
        "active",
        enabled
    );


    securityToggle.setAttribute(
        "aria-pressed",
        String(enabled)
    );


    if (enabled) {

        traceStatus.textContent =
            "Security view · orange marks the internet-facing boundary; blue marks the private application network.";

        selectArchitectureComponent("app");

    } else {

        traceStatus.textContent =
            "Security view disabled. Select a component or trace the complete request.";

        selectArchitectureComponent("nginx");
    }

});


/* =========================================================
   TROUBLESHOOTING STORY
   ========================================================= */

const diagnosticSteps = [
    {
        title: "Verify the service",
        text:
            "Confirm Nginx is running before diagnosing the network around it."
    },

    {
        title: "Test HTTP locally",
        text:
            "Use curl from the instance itself. If localhost works, the web service is listening and the investigation can move outward."
    },

    {
        title: "Inspect security groups",
        text:
            "Verify that the public instance permits the required HTTP traffic and that private-server rules only allow the intended internal source."
    },

    {
        title: "Verify routes and associations",
        text:
            "Check the public route table, Internet Gateway route, and subnet association. A correct server configuration cannot compensate for a broken network path."
    },

    {
        title: "Check the network ACL",
        text:
            "Validate the subnet-level filtering layer after the route and security groups have been confirmed."
    },

    {
        title: "Test the external port",
        text:
            "Test TCP port 80 from outside the instance to verify the full network path reaches Nginx."
    }
];


const diagnosticStepLabel =
    document.getElementById("diagnosticStep");

const diagnosticTitle =
    document.getElementById("diagnosticTitle");

const diagnosticText =
    document.getElementById("diagnosticText");

const diagnosticProgress =
    document.getElementById("diagnosticProgress");

const diagnosticPrev =
    document.getElementById("diagnosticPrev");

const diagnosticNext =
    document.getElementById("diagnosticNext");

const diagnosticDots =
    document.querySelectorAll(
        "[data-diagnostic-step]"
    );

let currentDiagnosticStep = 0;


const renderDiagnosticStep = (index) => {

    const boundedIndex =
        Math.max(
            0,
            Math.min(
                diagnosticSteps.length - 1,
                index
            )
        );


    currentDiagnosticStep =
        boundedIndex;


    const step =
        diagnosticSteps[boundedIndex];


    diagnosticStepLabel.textContent =
        `CHECK ${String(boundedIndex + 1).padStart(2, "0")} / ${String(diagnosticSteps.length).padStart(2, "0")}`;

    diagnosticTitle.textContent =
        step.title;

    diagnosticText.textContent =
        step.text;


    const percentage =
        ((boundedIndex + 1) / diagnosticSteps.length) * 100;

    diagnosticProgress.style.width =
        `${percentage}%`;


    diagnosticDots.forEach((dot) => {

        dot.classList.toggle(
            "active",
            Number(dot.dataset.diagnosticStep) === boundedIndex
        );

    });


    diagnosticPrev.disabled =
        boundedIndex === 0;

    diagnosticNext.disabled =
        boundedIndex === diagnosticSteps.length - 1;
};


diagnosticPrev.addEventListener("click", () => {
    renderDiagnosticStep(
        currentDiagnosticStep - 1
    );
});


diagnosticNext.addEventListener("click", () => {
    renderDiagnosticStep(
        currentDiagnosticStep + 1
    );
});


diagnosticDots.forEach((dot) => {

    dot.addEventListener("click", () => {

        renderDiagnosticStep(
            Number(dot.dataset.diagnosticStep)
        );

    });

});


renderDiagnosticStep(0);


/* =========================================================
   CAPABILITY EXPLORER
   ========================================================= */

const capabilityData = {
    networking: {
        index: "01",
        title: "Networking",
        description:
            "Understanding how endpoints communicate and how traffic moves through an infrastructure.",
        tags: [
            "TCP/IP",
            "IPv4",
            "Subnetting",
            "DNS",
            "DHCP",
            "VLANs",
            "Routing",
            "Switching"
        ]
    },

    cloud: {
        index: "02",
        title: "Cloud & Linux",
        description:
            "Building infrastructure in AWS and understanding the Linux systems running inside it.",
        tags: [
            "AWS",
            "VPC",
            "EC2",
            "IAM",
            "Security Groups",
            "Linux",
            "Nginx",
            "systemd",
            "SSH"
        ]
    },

    automation: {
        index: "03",
        title: "Automation",
        description:
            "Reducing repetitive work, versioning technical changes, and building repeatable workflows.",
        tags: [
            "PowerShell",
            "Git",
            "GitHub",
            "Documentation",
            "CI/CD Fundamentals"
        ]
    },

    security: {
        index: "04",
        title: "Security",
        description:
            "Applying access control and secure administration principles to the systems I build and support.",
        tags: [
            "Security+",
            "Access Control",
            "Hardening",
            "Secure Administration",
            "Network Segmentation"
        ]
    }
};


const capabilityButtons =
    document.querySelectorAll(
        ".capability-button"
    );

const capabilityIndex =
    document.getElementById(
        "capabilityIndex"
    );

const capabilityTitle =
    document.getElementById(
        "capabilityTitle"
    );

const capabilityDescription =
    document.getElementById(
        "capabilityDescription"
    );

const capabilityTags =
    document.getElementById(
        "capabilityTags"
    );


const selectCapability = (name) => {

    const data =
        capabilityData[name];

    if (!data) {
        return;
    }


    capabilityButtons.forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.capability === name
        );

    });


    capabilityIndex.textContent =
        data.index;

    capabilityTitle.textContent =
        data.title;

    capabilityDescription.textContent =
        data.description;


    capabilityTags.replaceChildren();


    data.tags.forEach((tag) => {

        const tagElement =
            document.createElement("span");

        tagElement.textContent =
            tag;

        capabilityTags.appendChild(
            tagElement
        );

    });

};


capabilityButtons.forEach((button) => {

    button.addEventListener("click", () => {

        selectCapability(
            button.dataset.capability
        );

    });

});


selectCapability("networking");


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );

const navSections = [
    "work",
    "experience",
    "capabilities",
    "contact"
]
    .map((id) => document.getElementById(id))
    .filter(Boolean);


if ("IntersectionObserver" in window) {

    const navObserver =
        new IntersectionObserver(
            (entries) => {

                const visibleEntry =
                    entries
                        .filter(
                            (entry) =>
                                entry.isIntersecting
                        )
                        .sort(
                            (a, b) =>
                                b.intersectionRatio -
                                a.intersectionRatio
                        )[0];


                if (!visibleEntry) {
                    return;
                }


                navLinks.forEach((link) => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                            `#${visibleEntry.target.id}`
                    );

                });

            },
            {
                rootMargin:
                    "-25% 0px -55% 0px",

                threshold: [
                    0,
                    0.1,
                    0.25,
                    0.5
                ]
            }
        );


    navSections.forEach((section) => {
        navObserver.observe(section);
    });

}