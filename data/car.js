export class Car {
    constructor(brand, model) {
      this.brand = brand;
      this.model = model;
      this.speed = 0;
      this.isTrunkOpen = false;
    }
  
    go() {
      if (this.isTrunkOpen) {
        console.log('Cannot drive while trunk is open!');
        return;
      }
      if (this.speed < 200) {
        this.speed = Math.min(this.speed + 5, 200);
      }
    }
  
    brake() {
      this.speed = Math.max(this.speed - 5, 0);
    }
  
    openTrunk() {
      if (this.speed > 0) {
        console.log('Cannot open trunk while car is moving!');
        return;
      }
      this.isTrunkOpen = true;
    }
  
    closeTrunk() {
      this.isTrunkOpen = false;
    }
  
    displayInfo() {
      console.log(`${this.brand} ${this.model}, Speed: ${this.speed} km/h, Trunk: ${this.isTrunkOpen ? 'Open' : 'Closed'}`);
    }
  }

  
const car1 = new Car('Toyota', 'Corolla');
  car1.openTrunk(); // ✅ Opens trunk
  car1.go();        // ❌ Won’t go because trunk is open
  car1.closeTrunk(); 
  car1.go();        // ✅ Will go
  car1.displayInfo();  


  export class RaceCar extends Car {
    constructor(brand, model, acceleration) {
      super(brand, model);
      this.acceleration = acceleration;
    }
  
    go() {
      if (this.speed < 300) {
        this.speed = Math.min(this.speed + this.acceleration, 300);
      }
    }
  
    // Race cars do not have trunks
    openTrunk() {
      console.log('Race cars do not have trunks.');
    }
  
    closeTrunk() {
      console.log('Race cars do not have trunks.');
    }
  
    displayInfo() {
      console.log(`${this.brand} ${this.model}, Speed: ${this.speed} km/h`);
    }
  }

const f1 = new RaceCar('McLaren', 'F1', 20);

f1.go(); // +20
f1.go(); // +20 → 40
f1.displayInfo(); // "McLaren F1, Speed: 40 km/h"

f1.openTrunk();