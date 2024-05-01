import Controller from './logic/controller.ts';

function validateIndexHtml() {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
}

function main() {
    validateIndexHtml();

    controller.initializeGameBoard();
    
    requestAnimationFrame((ts) => controller.gameLoop(ts));
}


// https://stackoverflow.com/questions/64752006/calculate-a-position-based-on-an-angle-a-speed-and-a-starting-position

// =============== ENTRY POINT ================
console.log("App startup...");

let controller = new Controller();

main();