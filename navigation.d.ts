import { CameraCapturedPicture } from "expo-camera";

export interface Screens {
  home: undefined;
  cameraSendPhoto: CameraCapturedPicture;
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList extends Screens {}
  }
}
