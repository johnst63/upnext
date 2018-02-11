
export class Player {
  //Headers must have user-read-playback-state scope authorized in order to read information.

  //Parameters
  id: string;
  is_active: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}
