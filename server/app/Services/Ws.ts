import { Server } from 'socket.io';
import AdonisServer from '@ioc:Adonis/Core/Server';

class Ws {
  public io: Server;
  private booted = false;
  private _connectedUsers = new Map<string, string>();

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return;
    }

    this.booted = true;
    this.io = new Server(AdonisServer.instance!, {
      cors: {
        origin: 'http://localhost:3000',
        credentials: true
      }
    });
  }

  get connectedUsers() {
    return this._connectedUsers;
  }
}

export default new Ws();
