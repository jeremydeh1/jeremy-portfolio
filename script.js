const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];


/* =========================================================
   ARCHITECTURE
   ========================================================= */

const architectureData = {

  internet: {
    type: "Request origin",

    title: "Internet / Client",

    text:
      "The request begins outside AWS. From here, it needs a valid path to a resource that is intentionally reachable from the internet."
  },

  gateway: {
    type: "VPC edge",

    title: "Internet Gateway",

    text:
      "The Internet Gateway is attached to the VPC. Combined with the public subnet's route table, it provides the path between the VPC and the internet."
  },

  nginx: {
    type: "Public entry point",

    title: "Public EC2 / Nginx",

    text:
      "Nginx accepts HTTP traffic from the internet and forwards application requests to the private EC2 instance over the VPC network."
  },

  app: {
    type: "Private application tier",

    title: "Private EC2 / Application",

    text:
      "The application runs on port 8080 without a public IPv4 address. It receives application traffic internally instead of being directly exposed to the internet."
  }

};


function selectArchitectureNode(name) {

  const data =
    architectureData[name];


  if (!data) {
    return;
  }


  $$(".architecture-node").forEach(
    (node) => {

      node.classList.toggle(
        "active",
        node.dataset.node === name
      );

    }
  );


  $("#detailType").textContent =
    data.type;


  $("#detailTitle").textContent =
    data.title;


  $("#detailText").textContent =
    data.text;

}


$$(".architecture-node").forEach(
  (node) => {

    node.addEventListener(
      "click",
      () => {

        selectArchitectureNode(
          node.dataset.node
        );

      }
    );

  }
);


/* =========================================================
   REQUEST TRACE
   ========================================================= */

const wait = (milliseconds) =>
  new Promise(
    (resolve) =>
      setTimeout(resolve, milliseconds)
  );


let tracing = false;


$("#runTrace").addEventListener(
  "click",
  async () => {

    if (tracing) {
      return;
    }


    tracing = true;

    $("#runTrace").disabled =
      true;


    const sequence = [
      "internet",
      "gateway",
      "nginx",
      "app"
    ];


    const connectors =
      $$(".connector");


    connectors.forEach(
      (connector) =>
        connector.classList.remove("trace")
    );


    for (
      let index = 0;
      index < sequence.length;
      index += 1
    ) {

      selectArchitectureNode(
        sequence[index]
      );


      if (index > 0) {

        connectors[
          index - 1
        ].classList.add(
          "trace"
        );

      }


      await wait(650);

    }


    await wait(400);


    connectors.forEach(
      (connector) =>
        connector.classList.remove("trace")
    );


    $("#detailType").textContent =
      "Request complete";


    $("#detailTitle").textContent =
      "200 OK";


    $("#detailText").textContent =
      "The request reached the private application through Nginx and the response returned to the client.";


    $("#runTrace").disabled =
      false;


    tracing = false;

  }
);


/* =========================================================
   TROUBLESHOOTING STORY
   ========================================================= */

const debugData = [

  {
    label: "Service",

    text:
      "First, confirm Nginx is actually running. There is no reason to troubleshoot AWS networking if the service itself is down."
  },

  {
    label: "Local test",

    text:
      "Test the service locally with curl. A successful local response proves the web service can answer requests on the host."
  },

  {
    label: "Security groups",

    text:
      "Verify the public instance permits the required HTTP traffic and that the private application's rule permits traffic from the intended source."
  },

  {
    label: "Routing",

    text:
      "Inspect the public route table, Internet Gateway route, and subnet association. A running service still needs a valid network path."
  },

  {
    label: "Network ACL",

    text:
      "Check the subnet-level network ACL after validating the service, security groups, and route configuration."
  },

  {
    label: "External test",

    text:
      "Finally, test TCP port 80 from outside the instance to verify the complete path from the internet to Nginx."
  }

];


function selectDebugStep(index) {

  const data =
    debugData[index];


  $$(".debug-step").forEach(
    (button, buttonIndex) => {

      button.classList.toggle(
        "active",
        buttonIndex === index
      );

    }
  );


  $("#debugLabel").textContent =
    data.label;


  $("#debugText").textContent =
    data.text;

}


$$(".debug-step").forEach(
  (button) => {

    button.addEventListener(
      "click",
      () => {

        selectDebugStep(
          Number(button.dataset.step)
        );

      }
    );

  }
);


/* =========================================================
   SMALL EASTER EGG

   Click JD five times.
   ========================================================= */

let eggClicks = 0;

let eggTimer;


$("#packetEgg").addEventListener(
  "click",
  () => {

    eggClicks += 1;


    clearTimeout(
      eggTimer
    );


    eggTimer =
      setTimeout(
        () => {
          eggClicks = 0;
        },
        2000
      );


    if (eggClicks >= 5) {

      eggClicks = 0;


      document.body.classList.toggle(
        "packet-mode"
      );


      const button =
        $("#packetEgg");


      button.textContent =
        document.body.classList.contains(
          "packet-mode"
        )
          ? "PACKET"
          : "JD";

    }

  }
);