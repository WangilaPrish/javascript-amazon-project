import {formatCurrency} from '../scripts/utils/money.js';
console.log('test suite: format currency')

console.log('converts cents into dollars');
if(formatCurrency(2095) === '20.95'){
    console.log('Test passed!');
} else {
    console.log('Test failed!');
}
console.log('works with zero');
if(formatCurrency(0) === '0.00'){
    console.log('Test passed!');
} else {
    console.log('Test failed!');
}
console.log('rounds up to nearest cent')
if(formatCurrency(2000.5) === '20.01'){
    console.log('Test passed!');
} else {
    console.log('Test failed!');
}

if(formatCurrency(2000.4) === '20.00'){
    console.log('Test passed!');
} else {
    console.log('Test failed!');
}