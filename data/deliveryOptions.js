import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

// Existing imports (if any)

export const deliveryOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0,
},{
    id: '2',
    deliveryDays: 3,
    priceCents: 499,
},{
    id: '3',
    deliveryDays: 1,
    priceCents: 999,
}];

export function getDeliveryOption(deliveryOptionId){
    let deliveryOption;
    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });
    return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(deliveryOptionId){
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const today = dayjs();
        const deliveryDate = today.add(
          deliveryOption.deliveryDays,
          'days'
        );
        return deliveryDate.format('dddd, MMMM D');
}

export default function isWeekend(date) {
    const day = date.day(); // Sunday = 0, Saturday = 6
    return day === 0 || day === 6;
  }
  