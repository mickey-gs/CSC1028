class Vehicle {
  constructor(tankSize, fuel, mileage) {
    this.refuel(10)
    this.tankSize = tankSize
    this.fuel = fuel
    this.mileage = mileage
  }

  drive(distance) {
    let fuelUsage = distance / this.mileage
    if (fuelUsage > this.fuel) {
      let distanceDriven = this.fuel * this.mileage
      this.fuel = 0
      return "The vehicle drove " + distanceDriven + " miles, and ran out of fuel."
    }
    else {
      this.fuel -= fuelUsage
      return "The vehicle drove " + distance + " miles, and has " + this.fuel + " gallons of fuel left."
    }
  }

  refuel(fuel) {
    this.fuel = (this.fuel + fuel > this.tankSize ? this.tankSize : this.fuel + fuel)
    return "The vehicle now has " + this.fuel + " gallons of fuel in the tank."
  }

  getDescription() {
    return "This vehicle has " + this.fuel + " gallons of fuel in the tank."
  }
}

class Car extends Vehicle {
  constructor(tankSize, fuel, mileage, make, model, year) {
    super(tankSize, fuel, mileage)
    this.make = make
    this.model = model
    this.year = year
  }

  getDescription() {
    return "This vehicle is a car; a " + this.year + " " + this.make + " " + this.model + ".\n" + super.getDescription()
  }
}

let car = new Car(9.0, 5.0, 50.0, "Ford", "Fiesta", 2011)
console.log(car.getDescription())
console.log(car.drive(50))
console.log(car.drive(4000))
console.log(car.refuel(4.5))
console.log(car.refuel(20.5))