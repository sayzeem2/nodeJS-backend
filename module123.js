//+++++++++++++++++++++++++++++++++++++MODULE 3++++++++++++++++++++++++++++++++++++++

// const { CancellationToken } = require("mongodb")

// ======================callback function=============================

// const greet = (name, callback) => {
//     console.log('Hello ' + name);
//     callback();// function call
// }

// const saybye = () => {
//     console.log('Goodbye');
// }

// greet('Zee', saybye);

//============================promises====================================
// const myPromise = new Promise((resolve, reject) => {
//     const success = false;
//     if (success) {
//         resolve("task resolved");
//     } else {
//         reject("Task rejected");
//     }
// })

// myPromise.then(result => {
//     console.log("success", result);
// })
//     .catch(error => {
//         console.error("Error", error);
//     })
//     .finally(() => {
//         console.error("abc");
//     })


//=======================async / await =======================================
// const fetchData = () => {
//     return new Promise(resolve => {
//         setTimeout(() => resolve("Data loaded"), 2000)
//     })
// }

// const loadFunction = async () => {
//     console.log("Start");
//     const result = await fetchData()
//     console.log(result);
//     console.log("end");
// }

// loadFunction()

//=======================Event Loop and concurrency model =======================================

//++++++++++++++++++++++++++++++++++++++Module 4+++++++++++++++++++++++++++++++++++++++++++++++++



