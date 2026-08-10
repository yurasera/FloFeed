import { supabase } from '../lib/supabase'
import type { Room, RoomCreateInput, RoomUpdateInput } from '../types/room'

function generateRoomCode() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

function mapRoomRow(row: {
    id: number
    room_name: string
    room_code: string
    master_id: string
    created_at: string
    updated_at: string | null
}): Room {
    return {
        id: row.id,
        roomName: row.room_name,
        roomCode: row.room_code,
        masterId: row.master_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at ?? row.created_at,
    }
}

export const roomService = {
    async getRoomsByMaster(masterId: string): Promise<Room[]> {
        const { data, error } = await supabase
            .from('rooms')
            .select('id, room_name, room_code, master_id, created_at, updated_at')
            .eq('master_id', masterId)
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(error.message)
        }

        return (data ?? []).map(mapRoomRow)
    },

    async getRoomByCode(roomCode: string): Promise<Room | null> {
        const normalizedCode = roomCode.trim().toUpperCase()

        const { data, error } = await supabase
            .from('rooms')
            .select('id, room_name, room_code, master_id, created_at, updated_at')
            .eq('room_code', normalizedCode)
            .maybeSingle()

        if (error) {
            throw new Error(error.message)
        }

        return data ? mapRoomRow(data) : null
    },

    async getRoomById(roomId: number): Promise<Room | null> {
        const { data, error } = await supabase
            .from('rooms')
            .select('id, room_name, room_code, master_id, created_at, updated_at')
            .eq('id', roomId)
            .maybeSingle()

        if (error) {
            throw new Error(error.message)
        }

        return data ? mapRoomRow(data) : null
    },

    async createRoom(input: RoomCreateInput): Promise<Room> {
        const { data, error } = await supabase
            .from('rooms')
            .insert({
                room_name: input.roomName,
                room_code: input.roomCode ?? generateRoomCode(),
                master_id: input.masterId,
            })
            .select('id, room_name, room_code, master_id, created_at, updated_at')
            .single()

        if (error) {
            throw new Error(error.message)
        }

        if (!data) {
            throw new Error('Gagal membuat room.')
        }

        return mapRoomRow(data)
    },

    async updateRoom(input: RoomUpdateInput): Promise<Room> {
        const { data, error } = await supabase
            .from('rooms')
            .update({ room_name: input.roomName })
            .match({ id: input.id, master_id: input.masterId })
            .select('id, room_name, room_code, master_id, created_at, updated_at')
            .single()

        if (error) {
            throw new Error(error.message)
        }

        if (!data) {
            throw new Error('Gagal memperbarui room.')
        }

        return mapRoomRow(data)
    },

    async deleteRoom(roomId: string, masterId: string): Promise<void> {
        const { error } = await supabase
            .from('rooms')
            .delete()
            .match({ id: roomId, master_id: masterId })

        if (error) {
            throw new Error(error.message)
        }
    },
}
