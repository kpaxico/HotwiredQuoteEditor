import { Controller } from 'stimulus';

export default class extends Controller {

  static targets = ['username'];
  static values = {
    counter: Number
  };
  static classes = ['empty'];

  connect() {
    this.sayHi('hello');
    this.styleUsername();
  }

  sayHi(controllerName) {
    console.log(`Hello from the '${controllerName}' controller.`, this.element);
  }

  greet(eventObj) {
    console.log('Hello from element:', this.element, eventObj.target);

    if (this.hasUsernameTarget)
      console.log(`Greetings ${this.usernameTarget.value ? this.usernameTarget.value : 'no one'}!`);

    this.counterValue++;
  }

  counterValueChanged(newValue, oldValue) {
    console.log(`Greeting count is ${newValue}`);
  }

  usernameChange(eventObj) {
    this.styleUsername();
  }

  styleUsername() {
    if (!this.usernameTarget.value)
      this.usernameTarget.classList.add(...this.emptyClasses);
    else
      this.usernameTarget.classList.remove(...this.emptyClasses);
  }
}