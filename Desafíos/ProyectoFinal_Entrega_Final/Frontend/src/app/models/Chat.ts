export interface Message {
  email: string;
    type: MessageType;
    creationTime: string;
    body: string;
}

export enum MessageType {
  USER = 'usuario', // preguntas
  SYSYEM = 'sistema' // respuestas
}
