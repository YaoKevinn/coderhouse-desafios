const parseArgs = require('minimist');
const defaultOptions = { default: { port: 8080 } }
const args = parseArgs(process.argv.slice(2), defaultOptions);

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

process.on("message", (parentMsg) => {
    if(!isNaN(parentMsg)){
        console.log(`Process child start with ${parentMsg} random numbers`);
        const result = {};
        for(let i = 0; i < parentMsg; i++) {
                const num = getRandomInt(1000);
                if (result[num]) {
                    result[num]++;
                } else {
                    result[num] = 1;
                }
        }
    
        process.send(result);
    }
    if(parentMsg === "end"){
        console.log("Process child ended");
        process.exit()
    }
});
