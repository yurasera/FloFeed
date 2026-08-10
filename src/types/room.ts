export interface Room {
  id: string
  roomName: string
  roomCode: string
  masterId: string
  createdAt: string
  updatedAt: string
}

export interface RoomCreateInput {
  roomName: string
  masterId: string
  roomCode?: string
}

export interface RoomUpdateInput {
  id: string
  roomName: string
  masterId: string
}
