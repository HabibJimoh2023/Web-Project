'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//DISPLAY THE MOVEMENTS ON THE APP...

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  //SORTING LOGIN....
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//MOVEMENTS BALANCE 
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

//MOVEMENTS SUMMARY
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}Eur`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}Eur`;

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * 1.2) / 100).filter((int, i, arr) => {
    // console.log(arr);
    return int >= 1;
  })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}Eur`;
};

//COMPUTE THE USERNAME FOR A MULTIPLE USERS
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
createUsernames(accounts);

//To See if it actual work.....
// console.log(accounts);

// COMPUTER A USERNAME FOR A SINGLE USERS

// USING ARROW FUNCTION TO COMPUTE THE USERNAME
// const createUsernames = function (user) {
//   const username = user.toLowerCase().split(' ').map(name => name[0]).join('');
//   return username
// };
// console.log(createUsernames('Steven Thomas Williams'));

// USING REGULAR FUNCTION TO COMPUTE THE USERNAME
// const user = 'Steven Thomas Williams'; // stw
// const username = user.toLowerCase().split(' ').map(function (name) {
//   return name[0]
// })
//   .join('');
// console.log(username);

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

//IMPLEMENTING LOGIN
//Event handler 
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log(`LOGIN`);

    //Display UI and Welcome Message 
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;

    containerApp.style.opacity = 100;

    //Clear the Inputs Field...
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //OR
    // inputLoginUsername.value = '';
    // inputLoginPin.value = '';

    //Update UI
    updateUI(currentAccount);
  }
});

//IMPLEMENTING TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 && receiveAcc && currentAccount.balance >= amount && receiveAcc?.username !== currentAccount.username) {

    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

//IMPLEMENTING LOAN LOGIC....
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    //Add Movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//CLOSE AN ACCOUNT USING THE FINDINDEX METHOD....
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);

    //Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//IMPLMENTING SORTING BUTTON 

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//LECTURE - TRAINING ON ARRAY 
//SIMPLE ARRAY METHODS......   

//SLICE METHOD
// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

//Note The Slice method is not mutatting the original array value.... 

//SPLICE METHOD the sole difference between the 'Slice and Splice Method' the slice is not mutating the original value while the splice method does mutate the original value...

//SPLICE METHOD
// console.log(arr.splice(2));
// console.log(arr);

// arr.splice(-1);
// console.log(arr);

// arr.splice(1, 2);
// console.log(arr);

//REVERSE
// arr = ['a', 'b', 'c', 'd', 'e']
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //NOTE: The reverse method also mutate the original array....

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);

// console.log([...arr, ...arr2]);

// //JOIN 
// console.log(letters.join(' - ')); 

// //The new "AT METHOD".... 
// const arr = [23, 11, 64];
// console.log(arr[2]);

// console.log(arr.at(2));

// //Getting the last element using various methods....
// console.log(arr[arr.length - 1]);

// console.log(arr.slice(-1)[0]);

// console.log(arr.at(-1));

//LOOPING ARRAYS: FOR-EACH......

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(`-------FOR-OF --------`);

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`-------FOR -EACH--------`);

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// });


// console.log(`------FOR OF -----`);

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You Withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`-----FOR EACH -----`);

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });



//FOR EACH WITH MAPS AND SETS..

//MAPS
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //SET

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

//DATA TRANSFORMATION WITH MAP, FILTER AND REDUCE

//ORIGINAL ARRAY
// [3, 1, 4, 3, 2]

// MAP METHOD: Map returns a new array containing the results of applying an operation on all original array elements

//Example
// current * 2
// [6, 2, 8, 6, 4]

//FILTER METHOD: Filter returns a new array containing the array elements that passed a specified test condition.

//Example
// current > 2
// [3, , 4, 3, ,]

//REDUCE METHOD: Reduce boil ("reduces") all array elements down to one single value (e.g. adding all elements together)

//Example
// acc + current 
//[13]

//THE MAP METHOD.........
// const euroToUsd = 1.1;

// const movementUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });

// console.log(movements);
// console.log(movementUSD);

// //OR

// const movementUSDfor = [];
// for (const mov of movements) movementUSDfor.push(mov * euroToUsd);
// console.log(movementUSDfor);

// //OR
// const movementUSDNew = movements.map(mov => mov * euroToUsd);

// console.log(movementUSDNew);

// //Example 
// movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You Withdrew ${Math.abs(mov)}`);
//   }
// });

// //OR

// const movementsDescriptions = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `Movement ${i + 1}: You deposited ${mov}`;
//   } else {
//     return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
//   }
// });

// console.log(movementsDescriptions);

// // //OR 

// const movementExtra = movements.map((mov, i, arr) =>
//   `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
// );

// console.log(movementExtra);

//THE FILTER METHOD...

//FOR DEPOSITS
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// // //OR 

// const depositFor = [];
// for (const mov of movements)
//   if (mov > 0) depositFor.push(mov);
// console.log(depositFor);

// //OR

// const deposit3 = movements.filter(mov => mov > 0);
// console.log(deposit3);

// //FOR WITHDRAWALS
// const withdrawals = [];
// for (const mov of movements)
//   if (mov < 0) withdrawals.push(mov);
// console.log(withdrawals);

// //OR

// const withdrawal = movements.filter(function (mov) {
//   return mov < 0;
// });

// console.log(withdrawal);

// //OR

// const withdrawal3 = movements.filter(mov => mov < 0);
// // console.log(withdrawal3);

// //THE REDUCE METHOD.....
// console.log(movements);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// //OR

// const balance1 = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance1);

// //OR.
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// //MAXIMUM VALUE......
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// //OR
// const max2 = movements.reduce(function (acc, mov) {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max2);

// //MINIMUM VALUE.......
// const min = movements.reduce((acc, mov) => {
//   if (acc < mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(min);

// //OR

// const min2 = movements.reduce(function (acc, mov) {
//   if (acc < mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(min);

//THE MAGIC OF CHAINING METHOD....Filter, Map, & Reduce

//TOTAL DEPOSIT IN EURO
// const totalDeposits = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
// console.log(totalDeposits);
// console.log(movements);

// //TOTAL DEPOSIT IN USD....
// const euroToUsd = 1.1;
// const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * euroToUsd).reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// //TOTAL WITHDRAWAL IN EURO....
// const totalWithdrawals = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
// console.log(totalWithdrawals);

// //TOTAL WITHDRAWAL IN USD.....
// const euroToUsd2 = 1.1;
// const totalWithdrawalUSD = movements.filter(mov => mov < 0).map(mov => mov * euroToUsd2).reduce((acc, mov) => acc + mov, 0);
// console.log(totalWithdrawalUSD);

//THE FIND METHOD........Simply return the first value that met the condition

//Arrow Function
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// //Regular function
// const firstWith = movements.find(function (mov) {
//   if (mov < 0) return mov;
//   else return 0;
// });
// console.log(firstWith);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// //THE SOME AND EVERY METHOD....

// console.log(movements);

// //EQUALITY
// console.log(movements.includes(-130));

// //SOME: CONDITION Its simply check if the condition has ever been existed even though its once.... if it does it return true.......

// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits);

// const anyDeposits2 = movements.some(mov => mov > 5000);
// console.log(anyDeposits2);

// const movements2 = [300, 300, 200, 200, 200];

// //EVERY: its all return true if all the condition are valid....
// console.log(movements.every(mov => mov > 0));
// console.log(movements2.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //SEPARATE CALLBACK
// const depositCall = mov => mov > 0;
// console.log(movements.some(depositCall));
// console.log(movements.every(depositCall));
// console.log(movements.filter(depositCall)); 

//FLAT

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6,]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// const overallBalance2 = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// //FLATMAP....

// const overallBalance3 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance3);

//SORTING ARRAYS

//STRING
//ASCENDING ORDER
// const owners = ['Habib', 'Yusuf', 'Yasmin', 'Nafisah'];
// console.log(owners.sort());
// console.log(owners);

// console.log(`----ASCENDING & DESCENDING ORDER--------`)
// //Ascending
// owners.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(owners);

// //Descending 
// owners.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
// console.log(owners);

// //NUMBERS
// //THIS TECHNIQUES DOES NOT WORK FOR NUMBERS...
// // console.log(movements);
// // console.log(movements.sort());

// //Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

// movements.sort((a, b) => a - b);
// console.log(movements);

// //Descending 
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

// movements.sort((a, b) => b - a);
// console.log(movements);

//MORE WAYS OF CREATING AND FILLING ARRAYS

//NORMAL WAY OF CREATING AN ARRAY BY TYPING THE VALUE....
// const arr = ([1, 2, 3, 4, 5, 6, 7]);
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// //CREATING AN ARRAY PROGRAMATICALLY
// const x = new Array(7);
// console.log(x);

// //Filling the Array this way will not work 
// console.log(x.map(() => 5));

// //Fill Method is the only way you can fill the empty array...
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// //Using the 'from Method' to fill an array.
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const dice = Array.from({ length: 100 }, (_, i) => i + 1);
// console.log(dice);

//ARRAY METHODS PRACTICE....
//1
// const bankDepositSum = accounts.map(acc => acc.movements).flat().filter(mov => mov > 0).reduce((sum, cur,) => sum + cur, 0);
// console.log(bankDepositSum);

// const bankDepositSum2 = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0).reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum2);

// //2
// const numDeposit1000 = accounts.flatMap(acc => acc.movements).
//   reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// // reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

// console.log(numDeposit1000);

// const numDeposit1000z = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length

// console.log(numDeposit1000z);

// // //Note - Suffixed Operator will not work
// // let a = 10;
// // console.log(a++);
// // console.log(a);

// // //Prefixed
// // let b = 10;
// // console.log(++b);
// // console.log(b);

// //3
// const sums = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//   cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//   return sums;
// },
//   { deposits: 0, withdrawals: 0 }
// );
// console.log(sums)

// //OR


// const { deposits, withdrawals } = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//   // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//   sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//   return sums;
// },
//   { deposits: 0, withdrawals: 0 }
// );
// console.log(deposits, withdrawals);

// //4. 
// //this is a nice title -> This Is a Nice Title

// const converTitleCase = function (title) {
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//   ).join(' ');
//   return titleCase;
// };

// console.log(converTitleCase('this is a nice title'));
// console.log(converTitleCase('this is a LONG title but not too long'));
// console.log(converTitleCase('and here is another title with an EXAMPLE'));