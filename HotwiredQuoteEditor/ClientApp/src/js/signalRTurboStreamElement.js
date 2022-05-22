import 'regenerator-runtime/runtime'
import { connectStreamSource, disconnectStreamSource } from "@hotwired/turbo"
import * as signalR from "@microsoft/signalr";

class SignalRTurboStreamElement extends HTMLElement {
  
  async connectedCallback() {
    connectStreamSource(this);

    // We are connecting to the hub where the name is given in hub attribute
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.getAttribute("hub"))
      .build();

    // We are subscribing to the event in the method attribute and send it to dispatch
    this.connection.on(this.getAttribute("method"), (message) => {
      this.dispatchMessageEvent(message);
    });

    // Start the connection
    this.connection.start();
  }

  dispatchMessageEvent(data) {
    const event = new MessageEvent("message", { data })
    return this.dispatchEvent(event)
  }

  disconnectedCallback() {
    disconnectStreamSource(this);
    if (this.connection) this.connection.stop();
  }

}

customElements.define("signalr-turbo-stream", SignalRTurboStreamElement);