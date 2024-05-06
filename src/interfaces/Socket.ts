interface ServerToClientEvents {
  addAnimal: (message: string) => void;
  addCategory: (message: string) => void;
  modifyAnimal: (message: string) => void;
}

interface ClientToServerEvents {
  update: (message: string) => void;
}

export { ServerToClientEvents, ClientToServerEvents };
