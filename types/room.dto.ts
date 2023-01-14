type Person = {
  name: string;
  id: string;
};

export interface RoomEntity {
  name: string;
  _id?: string;
  createdBy: Person;
  type: string;
  isActive: boolean;
  dislikeMembers: string[];
  members: Person[];
}
