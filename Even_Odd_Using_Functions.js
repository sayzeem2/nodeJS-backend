//----------------------Function Expression to check if the number is EVEN or ODD--------------------------------------
const evenOddCheck = function (number) {
    if ((number % 2) == 0) {
        if ((number % 3) == 0) {
            console.log(number + " is divisible by 3");
        } else {
            console.log(number + " is not divisible by 3");
        }
        console.log(number + " is divisible by 2");
        console.log(number + " is Even");
    } else {
        if ((number % 3) == 0) {
            console.log(number + " is divisible by 3");
        } else {
            console.log(number + " is not divisible by 3");
        }
        console.log(number + " is Odd");
    }
}

//--------------------------------------Function Call--------------------------------------

evenOddCheck(9);