const terminalInput = document.getElementById("terminal-input");
const terminalContent = document.getElementById("terminal-content");
const terminalBody = document.getElementById("terminal-body");


const commands = {

    help: `
Available commands:

about        Who I am
network      Networking focus
cloud        Cloud focus
devops       DevOps & automation

skills       Go to technical skills
experience   Go to experience
projects     Go to projects
contact      Go to contact

clear        Clear terminal
`,


    about: `
Jeremy Dehorty

IT professional working across enterprise systems,
networking, infrastructure, and secure computing environments.

Currently expanding deeper into cloud engineering,
network automation, and DevOps.
`,


    skills: `
TECHNICAL FOCUS

[ NETWORKING ]
TCP/IP • DNS • DHCP • VLANs • Routing • Switching

[ CLOUD ]
AWS • EC2 • VPC • IAM • S3 • Route 53

[ DEVOPS ]
Git • GitHub • PowerShell • Linux • CI/CD • Terraform

[ SECURITY ]
Security+ • Access Control • System Hardening
`,


    network: `
NETWORKING

Focus:
> TCP/IP
> IPv4 & subnetting
> DNS / DHCP
> VLAN segmentation
> Routing & switching
> Packet analysis
> Enterprise troubleshooting

Current objective:
Build deeper network engineering and automation skills.
`,


    cloud: `
CLOUD / AWS

Current focus:
> EC2
> VPC architecture
> Subnets & route tables
> IAM
> Security Groups
> S3
> Route 53
> CloudWatch

Objective:
Design secure, automated, highly available infrastructure.
`,


    devops: `
DEVOPS / AUTOMATION

Current focus:
> Git & GitHub
> Linux
> PowerShell
> CI/CD
> Infrastructure as Code
> Terraform

Objective:
Replace repetitive manual processes with
repeatable, version-controlled automation.
`,


    projects: `
PROJECTS

[01] Personal Portfolio
HTML • CSS • JavaScript • Git

[02] AWS Infrastructure Lab
Coming Soon

[03] Enterprise Network Lab
Coming Soon

Scroll to Featured Projects for more information.
`,


    contact: `
CONTACT

LinkedIn  → See Contact section
GitHub    → See Contact section
Email     → See Contact section
`

};
function scrollToSection(sectionId) {

    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function runCommand(command) {

    const cleanedCommand = command
        .trim()
        .toLowerCase();


    if (cleanedCommand === "") {
        return;
    }


    // Show command that user entered
    const commandLine = document.createElement("div");

    commandLine.className = "terminal-line";

    commandLine.innerHTML = `
        <span class="prompt">jeremy@portfolio:~$</span>
        <span class="command"></span>
    `;

    commandLine.querySelector(".command").textContent = command;

    terminalContent.appendChild(commandLine);

// WEBSITE NAVIGATION COMMANDS

if (cleanedCommand === "projects") {

    scrollToSection("projects");

} else if (cleanedCommand === "experience") {

    scrollToSection("experience");

} else if (cleanedCommand === "skills") {

    scrollToSection("skills");

} else if (cleanedCommand === "contact") {

    scrollToSection("contact");

}
   // CLEAR TERMINAL
if (cleanedCommand === "clear") {

    terminalContent.innerHTML = "";
    return;

}

// EASTER EGG
if (cleanedCommand === "sudo hire jeremy") {

    const output = document.createElement("div");

    output.className = "terminal-output";

    output.textContent =
`[sudo] evaluating candidate...

Security+ ............ FOUND
Enterprise IT ........ FOUND
Networking ........... BUILDING
Cloud ................ BUILDING
DevOps ............... BUILDING

ACCESS GRANTED.

Redirecting to contact...`;

    terminalContent.appendChild(output);

    setTimeout(function() {
        scrollToSection("contact");
    }, 2500);

    return;
}
// WEBSITE NAVIGATION
const navigationCommands = {
    projects: "projects",
    experience: "experience",
    skills: "skills",
    contact: "contact"
};


if (navigationCommands[cleanedCommand]) {

    const sectionId = navigationCommands[cleanedCommand];

    const output = document.createElement("div");

    output.className = "terminal-output";

    output.textContent =
        `Opening ${cleanedCommand}...`;

    terminalContent.appendChild(output);


    setTimeout(function() {

        scrollToSection(sectionId);

    }, 400);

}


// NORMAL TERMINAL COMMAND
else if (commands[cleanedCommand]) {

    const output = document.createElement("div");

    output.className = "terminal-output";

    output.textContent =
        commands[cleanedCommand];

    terminalContent.appendChild(output);

}


// UNKNOWN COMMAND
else {

    const output = document.createElement("div");

    output.className =
        "terminal-output terminal-error";

    output.textContent =
        `Command not found: ${command}
Type "help" for available commands.`;

    terminalContent.appendChild(output);

}


terminalBody.scrollTop =
    terminalBody.scrollHeight;
}


terminalInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        runCommand(terminalInput.value);

        terminalInput.value = "";

    }

});


terminalBody.addEventListener("click", function() {
    terminalInput.focus();
});


terminalInput.focus();